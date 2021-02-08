const React = require('react')

export default class CreateDialogue extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {

    }

    render() {
        if(!this.props.attributes)
            return <div></div>

        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input
                    type={'text'}
                    placeholder={attribute}
                    ref={attribute}
                    className={'field'}/>
            </p>
        );
        return (
            <div>
                <a href={'#createEmployee'}>Create</a>
                <div id={'createEmployee'} className={'modalDialog'}>
                    <div>
                        <a href={'#'} title={'close'} className={'close'}>
                            X
                        </a>
                        <h2>Create new employee</h2>
                        <form>
                            {inputs}
                            <button
                                    onClick={this.handleSubmit}>
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}