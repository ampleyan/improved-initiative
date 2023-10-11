import * as React from "react";

export interface PromptInt {
  formElement?: HTMLFormElement;
  conditions?:  Array<any>;
  conditionsCurrent?:  Array<any>;

}

export class Prompt extends React.Component<PromptInt> {
  private conditions = this.props.conditions;
  private conditionsCurrent = this.props.conditionsCurrent;

    constructor(props) {
        super(props);
    this.state = {
        'conditions':props['conditions'],
        'conditionsCurrent':props['conditionsCurrent']
    }        // console.log(this)
    }

    public render() {
        console.log(this.props)
        return (
            // <form className="prompt">
                 this.props.conditionsCurrent.length > 0 && (
                       this.props.conditionsCurrent.map((condition, index) => (
                            <form className="p-view-conditions" key={'form-'+index}>
                                <div className="p-condition-reference" key={'cond-'+index}>
                                    <div><h3>{condition.name}</h3>
                                        {/*<div>*/}
                                            {/*<ul>*/}
                                                {/*<li>{condition.desc}</li>*/}
                                                {condition.desc.split('\n').map((item, itemIndex) => (
                                            <p key={itemIndex}>{item}</p>
                                                    ))}

                                            {/*</ul>*/}
                                        {/*</div>*/}
                                    </div>

                                </div>
                            </form>
                           ))
                     )
            // </form>
        );
    }
}

export class PlayerViewTags extends React.Component<PromptInt> {

  constructor(props) {
    super(props);
    this.state = {
        'conditions':props['conditions'],
        'conditionsCurrent':props['conditionsCurrent']
    }
  }
    // const spellEditorProps = useSubscription(props.tracker.SpellEditorProps);
      public render() {
          const prompts = this.state['conditionsCurrent']
          // const formElement = props.formElement
          // this.state['formElement']
          console.log(prompts)
          return (
              <div
                   className="p-view-tags"

              >

                  <Prompt conditionsCurrent={prompts} conditions={ this.state['conditions']}/>

              </div>
          );
      }
}
