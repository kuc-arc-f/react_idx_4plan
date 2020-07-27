
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Dexie from 'dexie';
import LibPlan from '../../libs/LibPlan';
//
class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {p_date: '', content: ''}
        this.id = 0
        this.handleClick = this.handleClick.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.db = null
    }
    componentDidMount(){
        this.id  = parseInt(this.props.match.params.id)
        var config = LibPlan.get_const()
        this.db = new Dexie( config.DB_NAME );
        this.db.version(config.DB_VERSION).stores( config.DB_STORE );         
console.log( this.id);
        this.get_item( this.id )
    }
    async get_item(id){
        const item = await this.db.plans.get(id);
        this.setState({ 
            content: item.content
        });        
        console.log(item);                          
    }
    update_item(){
        this.db.plans.update(parseInt( this.id ) , {
            content: this.state.content,
        });
        this.props.history.push("/plan");
//console.log( task )
    }    
    handleClickDelete(){
//        console.log("#-handleClickDelete")
        this.db.plans.delete(parseInt(this.id) );
        this.props.history.push("/plan");
    }
    handleClick(){
        console.log("#-handleClick")
        this.update_item()
//        console.log( this.state )
    }        
    handleChangeContent(e){
        this.setState({ content: e.target.value })
    }
    render(){
        return (
        <div className="container">
            <Link to="/plan" className="btn btn-outline-primary mt-2">Back</Link>
            <hr className="mt-2 mb-2" />            
            <h1>Plan - Edit</h1>
            <hr className="mt-2 mb-2" />
            <div className="form-group">
                <label>Content:</label>
                <div className="col-sm-10">
                    <textarea type="text" className="form-control" rows="10"
                    value={this.state.content}
                    onChange={this.handleChangeContent.bind(this)} ></textarea>
                </div>
            </div>            
            <div className="form-group">
                <button className="btn btn-primary" onClick={this.handleClick}>Save
                </button>
            </div>
            <hr />
            <div className="form-group">
                <button className="btn btn-outline-danger btn-sm mt-2"
                onClick={this.handleClickDelete}>Delete
                </button>
            </div>

        </div>
        )
    }
}
export default Edit;