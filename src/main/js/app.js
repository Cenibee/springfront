const React = require('react');

// DOM 과 React 서버 렌더러의 진입점 역할을 하는 패키지
const ReactDOM = require('react-dom')

const axios = require('axios')

// 리액트 컴포넌트로 사용할 App 컴포넌트에 대한 선언
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employees: []};
    }

    // DOM 에 React 가 렌더링된 후 실행할 함수
    componentDidMount() {
        axios.get('/api/employees')
            .then(response => {
                this.setState({employees: response.data._embedded.employees});
            });
    }

    // 화면에 컴포넌트를 그리도록하는 API - 프레임워크 레벨에서 콜된다.
    render () {
        return (
            <EmployeeList employees={this.state.employees}/>
        )
    }
}

class EmployeeList extends React.Component {
    render() {
        const employees = this.props.employees.map(employee =>
            <Employee key={employee._links.self.href} employee={employee}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                    </tr>
                    {employees}
                </tbody>
            </table>
        )
    }
}

class Employee extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.employee.firstName}</td>
                <td>{this.props.employee.lastName}</td>
                <td>{this.props.employee.description}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)