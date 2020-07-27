
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Dexie from 'dexie';
import LibPlan from '../../libs/LibPlan';
import LibCommon from '../../libs/LibCommon';


//
class Create extends Component {
    constructor(props){
        super(props)
//        this.state = {title: '', content: ''}
        this.state = {p_date: '', content: ''}
        this.handleClick = this.handleClick.bind(this);
        this.db = null
    }
    componentDidMount(){
        var config = LibPlan.get_const()
        this.db = new Dexie( config.DB_NAME );
        this.db.version(config.DB_VERSION).stores( config.DB_STORE );                 
        var dt = LibCommon.formatDate(new Date(), 'YYYY-MM-DD')
        this.setState({p_date: dt })
    }
    /*
    handleChangeTitle(e){
        this.setState({title: e.target.value})
    }
    */
    handleChangeDate(e){
        this.setState({p_date: e.target.value})
    }
    handleChangeContent(e){
        this.setState({content: e.target.value})
    }
    add_item(){
        var date_str = this.state.p_date + "T00:00:00.000Z"
        var date = new Date( date_str );
        var item = {
            p_date: date,
            content: this.state.content,
            created_at: new Date(),
        }
        this.db.plans.add( item)
//        console.log( task )
        this.props.history.push("/plan");
    }
    handleClick(){
        console.log("#-handleClick")
        this.add_item()
//        console.log( this.state )
    }
    render() {
        return (
        <div className="container">
            <Link to="/plan" className="btn btn-outline-primary mt-2">Back</Link>
            <hr className="mt-2 mb-2" />
            <h1 className="mt-2">Plan - Create</h1>
            <div className="form-group">
                <label className="col-sm-3 control-label">日付</label>
                <div className="col-sm-4">
                    <input type="date"  className="form-control"
                    value={this.state.p_date}                    
                    onChange={this.handleChangeDate.bind(this)}
                     required="required" />
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

