import { Formik, FormikProps } from "formik";
import * as React from "react";

export interface PromptProps<T extends object> {
  onSubmit: (submittedValues: T) => boolean;
  children: React.ReactChild;
  autoFocusSelector: string;
  initialValues: T;
}

export class Prompt<T extends object> extends React.Component<
  PromptProps<T> & {
    onCancel: () => void;
  }
> {
  private formElement: HTMLFormElement;

  public render() {
    return (
      <Formik
        initialValues={this.props.initialValues || {}}
        onSubmit={values => {
          this.props.onSubmit(values);
        }}
      >
        {(props: FormikProps<any>) => (
          <form
            ref={r => (this.formElement = r)}
            className="prompt"
            onSubmit={props.handleSubmit}
            onKeyUp={(e: React.KeyboardEvent<HTMLFormElement>) => {
              if (e.key == "Escape") {
                this.props.onCancel();
              }
            }}
          >
            {this.props.children}
          </form>
        )}
      </Formik>
    );
  }

  public componentDidMount() {
    setTimeout(this.delaySoAutoFocusedFieldDoesntSwallowHotkey);
  }

  private delaySoAutoFocusedFieldDoesntSwallowHotkey = () => {
    if (!this.formElement) {
      return;
    }

    //prevent mounted element from swallowing hotkey
    const element: HTMLInputElement = this.formElement.querySelector(
      this.props.autoFocusSelector
    );

    if (!element) {
      return;
    }

    if (element.focus) {
      element.focus();
    }
    if (element.select) {
      element.select();
    }
  };
}

interface PendingPromptsProps {
  promptsAndIds: [PromptProps<object>, string][];
  removePrompt: (promptId: string) => void;
}

export class PendingPrompts extends React.Component<PendingPromptsProps> {
  public render() {
    const emptyClassName =
      this.props.promptsAndIds.length == 0 ? " empty" : " tutorial-focus";
    return (
      <div className={"prompts" + emptyClassName}>
        {this.props.promptsAndIds.map(promptAndId => {
          const [prompt, promptId] = promptAndId;

          return (
            <Prompt
              key={promptId}
              {...prompt}
              onSubmit={values => {
                const shouldResolve = prompt.onSubmit(values);
                if (shouldResolve) {
                  this.props.removePrompt(promptId);
                }
                return shouldResolve;
              }}
              onCancel={() => {
                this.props.removePrompt(promptId);
              }}
            />
          );
        })}
      </div>
    );
  }
}
