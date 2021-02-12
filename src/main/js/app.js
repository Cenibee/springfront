const React = require('react');

// DOM 과 React 서버 렌더러의 진입점 역할을 하는 패키지
const ReactDOM = require('react-dom')

const axios = require('axios')

const stompClient = require('./websocket-listener')

import EmployeeList from './employee-list'
import CreateDialogue from './create-dialogue'
import 'regenerator-runtime/runtime'

// 리액트 컴포넌트로 사용할 App 컴포넌트에 대한 선언
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            pageSize: 2
        };

        this.onCreate = this.onCreate.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    }

    async loadFromServer(pageSize, page=0) {
        const employeeCollection = await axios.get('/api/employees', {
            params: {
                size: pageSize,
                page: page
            }
        });

        const schema = await axios.get(employeeCollection.data._links.profile.href, {
            headers:{'Accept': 'application/schema+json'}
        });

        const employees = await Promise.all(employeeCollection.data._embedded.employees.map(employee =>
            axios.get(employee._links.self.href)
        ));

        Object.keys(schema.data.properties).forEach(function (property) {
            if(schema.data.properties[property].hasOwnProperty('format') &&
                    schema.data.properties[property].format === 'uri') {
                delete schema.data.properties[property];
            }
            else if(schema.data.properties[property].hasOwnProperty('$ref')) {
                delete schema.data.properties[property];
            }
        })

        this.setState({
            employees: employees,
            pageSize: pageSize,
            links: employeeCollection.data._links,
            page: employeeCollection.data.page,
            attributes: Object.keys(schema.data.properties)
        });
    }

    async onCreate(newEmployee) {
        const employeeCollection = await axios.get('/api/employees');

        await axios.post(employeeCollection.data._links.self.href, newEmployee, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    async onUpdate(employee, updatedEmployee) {
        if(employee.data.manager.name !== this.props.loggedInManager) {
            alert("You are not authorized to update");
            return;
        }

        await axios.put(employee.data._links.self.href, updatedEmployee, {
            headers: {
                'Content-Type': 'application/json',
                'If-Match': employee.headers['etag']
            }
        }).catch(reason => {
            alert('ACCESS DENIED: You are not authorized to update ' + reason);
        });
    }

    async onDelete(employee) {
        await axios.delete(employee._links.self.href).catch(reason => {
            alert(reason);
        });
    }

    updatePageSize(pageSize) {
        if(pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize)
        }
    }

    onNavigate(navUri) {
        axios.get(navUri).then(employeeCollection => {
            Promise.all(employeeCollection.data._embedded.employees.map(employee =>
                axios.get(employee._links.self.href)
            )).then(employees => {
                this.setState({
                    employees: employees,
                    links: employeeCollection.data._links,
                    page: employeeCollection.data.page
                });
            });
        });
    }

    refreshAndGoToLastPage() {
        axios.get('/api/employees', {
            params: {'size': this.state.pageSize}
        }).then(response => {
            if(typeof response.data._links.last !== 'undefined') {
                this.onNavigate(response.data._links.last.href);
            } else {
                this.onNavigate(response.data._links.self.href);
            }
        });
    }

    refreshCurrentPage() {
        this.loadFromServer(this.state.pageSize, this.state.page.number);
    }

    // DOM 에 React 가 렌더링된 후 실행할 함수
    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        stompClient.register([
            {route: '/topic/newEmployee', callback: this.refreshAndGoToLastPage},
            {route: '/topic/updateEmployee', callback: this.refreshCurrentPage},
            {route: '/topic/deleteEmployee', callback: this.refreshCurrentPage}
        ]);
    }

    // 화면에 컴포넌트를 그리도록하는 API - 프레임워크 레벨에서 콜된다.
    render () {
        return (
            <div>
                <EmployeeList
                    links={this.state.links}
                    employees={this.state.employees}
                    attributes={this.state.attributes}
                    loggedInManager={this.props.loggedInManager}
                    onUpdate={this.onUpdate}
                    onNavigate={this.onNavigate}
                    onDelete={this.onDelete}
                    updatePageSize={this.updatePageSize}/>
                <CreateDialogue
                    attributes={this.state.attributes}
                    onCreate={this.onCreate}/>
            </div>
        )
    }
}

ReactDOM.render(
    <App loggedInManager={document.getElementById('managername').innerHTML}/>,
    document.getElementById('react')
)