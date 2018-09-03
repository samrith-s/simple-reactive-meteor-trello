import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Task from './Task.js';

import { Tasks } from '../api/tasks.js';

// App component - represents the whole app
class App extends Component {
    state = {
        hideCompleted: false
    };

    getTasks() {
        return [
            { _id: 1, text: 'This is task 1' },
            { _id: 2, text: 'This is task 2' },
            { _id: 3, text: 'This is task 3' }
        ];
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }

        return filteredTasks.map(task => <Task key={task._id} task={task} />);
    }

    handleSubmit = event => {
        event.preventDefault();

        // Find the text field via the React ref
        const text = this.input.value.trim();

        Tasks.insert({
            text,
            createdAt: new Date() // current time
        });

        // Clear form
        this.input.value = '';
    };

    toggleHideCompleted = () => {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    };

    handleInputRef = ref => {
        this.input = ref;
    };

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted}
                        />
                        Hide Completed Tasks
                    </label>

                    <form className="new-task" onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            ref={this.handleInputRef}
                            placeholder="Type to add new tasks"
                        />
                    </form>
                </header>

                <ul>{this.renderTasks()}</ul>
            </div>
        );
    }
}

export default withTracker(() => ({
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
}))(App);