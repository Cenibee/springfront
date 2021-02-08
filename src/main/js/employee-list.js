const React = require('react');

export default class EmployeeList extends React.Component {
    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
    }

    handleNavFirst(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }
    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }
    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }
    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        const employees = this.props.employees.map(employee =>
            <Employee
                key={employee._links.self.href}
                employee={employee}
                onDelete={this.props.onDelete}/>
        );

        const navLinks = [];
        if(this.props.links && 'first' in this.props.links) {
            navLinks.push(<button key={'first'} onClick={this.handleNavFirst}>&lt;&lt;</button> );
        }
        if(this.props.links && 'prev' in this.props.links) {
            navLinks.push(<button key={'prev'} onClick={this.handleNavPrev}>&lt;</button> );
        }
        if(this.props.links && 'next' in this.props.links) {
            navLinks.push(<button key={'next'} onClick={this.handleNavNext}>&gt;</button> );
        }
        if(this.props.links && 'last' in this.props.links) {
            navLinks.push(<button key={'last'} onClick={this.handleNavLast}>&gt;&gt;</button> );
        }

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                        <th>Delete</th>
                    </tr>
                    {employees}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }
}

class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.employee);
    }

    render() {
        return (
            <tr>
                <td>{this.props.employee.firstName}</td>
                <td>{this.props.employee.lastName}</td>
                <td>{this.props.employee.description}</td>
                <td><button onClick={this.handleDelete}>Delete</button></td>
            </tr>
        )
    }
}
