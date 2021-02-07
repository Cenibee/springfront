const React = require('react');

// DOM 과 React 서버 렌더러의 진입점 역할을 하는 패키지
const ReactDOM = require('react-dom')

const axios = require('axios')

import EmployeeList from './employee-list'

// 리액트 컴포넌트로 사용할 App 컴포넌트에 대한 선언
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employees: []};
    }

    // 파트 1에서 만들었던 전체 정보를 가져오는 요청
    loadFromServerAtOnce() {
        axios.get('/api/employees')
            .then(response => {
                this.setState({employees: response.data._embedded.employees});
            });
    }

    // Employees 관련 정보를 this.state 에 셋하는 요청
    loadFromServer(pageSize) {
        axios.get('/api/employees')
            .then(employeeCollection => {
                this.setState({
                    employees: employeeCollection.data._embedded.employees,
                    pageSize: pageSize,
                    links: employeeCollection.data._links
                });

                axios.get(employeeCollection.data._links.profile.href, {
                    headers: {'Accept': 'application/schema+json'}
                }).then(schema => {
                    this.setState({
                        attributes: Object.keys(schema.data.properties)
                    });
                });
            });
    }

    // DOM 에 React 가 렌더링된 후 실행할 함수
    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    // 화면에 컴포넌트를 그리도록하는 API - 프레임워크 레벨에서 콜된다.
    render () {
        return (
            <EmployeeList employees={this.state.employees}/>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)