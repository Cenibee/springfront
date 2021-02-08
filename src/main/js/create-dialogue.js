const React = require('react')
const ReactDOM = require('react-dom')

export default class CreateDialogue extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();
        const newEmployee = {};
        this.props.attributes.forEach(attribute => {
            // TODO deprecated API
            newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        // 부모의 핸들러는 바인딩할 필요 없다.
        this.props.onCreate(newEmployee);

        this.props.attributes.forEach(attribute => {
            // TODO deprecated API
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        window.location = "#";
    }

    render() {
        // attributes 가 셋되지 않았을 때는 빈 div 사용
        if(!this.props.attributes)
            return <div></div>

        // attributes를 읽어와서 <p><input></p> 태그 형식의 배열을 생성한다.
        const inputs = this.props.attributes.map(attribute =>
            // 여러 자식 컴포넌트를 가지므로 key 를 넣는다.
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