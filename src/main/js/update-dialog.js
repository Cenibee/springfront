import React from 'react'

export default class UpdateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = {}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const updatedEmployee = {};
        this.props.attributes.forEach(attribute => {
            updatedEmployee[attribute] = this.inputRef[attribute].current.value.trim()
        });
        this.props.onUpdate(this.props.employee, updatedEmployee);
        window.location = '#';
    }

    render() {
        // attributes 가 셋되지 않았을 때는 빈 div 사용
        if(!this.props.attributes)
            return <div/>

        const inputs = this.props.attributes.map(attribute => {
            this.inputRef[attribute] = React.createRef();
            return (
                <p key={attribute}>
                    <input
                        type={'text'}
                        placeholder={attribute}
                        defaultValue={this.props.employee.data[attribute]}
                        ref={this.inputRef[attribute]}
                        className={'field'}/>
                </p>
            )
        });
        const dialogId = 'updateEmployee-' + this.props.employee.data._links.self.href;

        return (
            <div key={this.props.employee.data._links.self.href}>
                <a href={'#' + dialogId}>Update</a>
                <div id={dialogId} className={'modalDialog'}>
                    <a href={'#'} title={'Close'} className={'close'}>X</a>
                    <h2>Update an employee</h2>
                    <form>
                        {inputs}
                        <button onClick={this.handleSubmit}>Update</button>
                    </form>
                </div>
            </div>
        );
    }

}