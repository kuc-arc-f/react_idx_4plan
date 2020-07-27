
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Dexie from 'dexie';
import LibTodo from '../../libs/LibTodo';

//
class Create extends Component {
    constructor(props){
        super(props)
        this.state = {title: '', content: ''}
        this.handleClick = this.handleClick.bind(this);
        this.db = null
    }
    componentDidMount(){
        var config = LibTodo.get_const()
        this.db = new Dexie( config.DB_NAME );
        this.db.version(config.DB_VERSION).stores( config.DB_STORE );                 
    }
    handleChangeTitle(e){
        this.setState({title: e.target.value})
    }
    handleChangeContent(e){
        this.setState({content: e.target.value})
    }
    add_item(){
        var item = {
            title: this.state.title,
            content: this.state.content,
            complete: 0,
            created_at: new Date(),
        }
        this.db.todos.add( item )
//        console.log( task )
        this.props.history.push("/todo");
    }
    handleClick(){
        console.log("#-handleClick")
        this.add_item()
//        console.log( this.state )
    }
    render() {
        return (
        <div className="container">
            <Link to="/task" className="btn btn-outline-primary mt-2">Back</Link>
            <hr className="mt-2 mb-2" />
            <h1 className="mt-2">Todo - Create</h1>
            <div className="form-group">
                <label>Title:</label>
                <div className="col-sm-6">
                    <input type="text" className="form-control"
                            onChange={this.handleChangeTitle.bind(this)}/>                    
                </div>
            </div>
            <div className="form-group">
                    <label>Content:</label>
                    <div className="col-sm-10">
                        <textarea type="text" className="form-control" rows="10"
                        onChange={this.handleChangeContent.bind(this)} ></textarea>
                    </div>
            </div>
            <br />
            <div className="form-group">
                <button className="btn btn-primary" onClick={this.handleClick}>Create
                </button>
            </div>
        
        </div>
        )
    }
}
export default Create;

