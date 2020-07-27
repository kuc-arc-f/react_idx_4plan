import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import IndexRow from './IndexRow';
import Dexie from 'dexie';
import moment from 'moment'
import LibPlan from '../../libs/LibPlan';
//import LibDexie from '../../libs/LibDexie';

import '../../css/PlanIndex.css';
//
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            data_org: [],
            weeks :[],
//            weeks_arr :[],
            month : null,
            month_str : "",
        }
        this.db = null
        this.handleClickExport = this.handleClickExport.bind(this);
        this.handleClickBefore = this.handleClickBefore.bind(this);
        this.handleClickAfter = this.handleClickAfter.bind(this);
    }
    componentDidMount(){
        var config = LibPlan.get_const()
        this.db = new Dexie( config.DB_NAME );
        this.db.version(config.DB_VERSION).stores( config.DB_STORE );
        var dt = moment( )
        var weeks = LibPlan.get_week_items( dt )
//console.log( weeks )
        this.setState({
            weeks: weeks,
            month : dt,
            month_str : dt.format('YYYY-MM') 
        })
        this.get_items( dt )        
    }
    handleClickAfter(){
        var dt = this.state.month
        var sub = dt.add(1, 'month').startOf('month')
console.log( sub )
        this.change_month(sub)
        this.get_items(sub)
    }
    handleClickBefore(){
        var dt = this.state.month
        var sub = dt.add(-1, 'month').startOf('month')
console.log( sub )
        this.change_month(sub)
        this.get_items(sub)
    }
    change_month(dt){
        var weeks = LibPlan.get_week_items( dt )
        this.setState({
            weeks: weeks,
            month : dt,
            month_str : dt.format('YYYY-MM') 
        })        
    }
    handleClickExport(){
        console.log("#-handleClickExport")
        var content = JSON.stringify( this.state.data_org );
// console.log(content)
        var blob = new Blob([ content ], { "type" : "application/json" });
        var fname = "plan.json"
        if (window.navigator.msSaveBlob) { 
            console.log("#-msSaveBlob")
            window.navigator.msSaveBlob(blob, fname ); 
            window.navigator.msSaveOrOpenBlob(blob, fname ); 
        } else {
            console.log("#-msSaveBlob-false")
            document.getElementById("download").href = window.URL.createObjectURL(blob);
        }        
//        console.log( this.state )
    }    
    async get_items(target_month){
        var dt = moment( target_month.format("YYYY-MM-DD") )
        var start = dt.startOf('month')
        dt = moment( target_month.format("YYYY-MM-DD") )
        var end = dt.add(1, 'month').startOf('month')
        var start_str = start.format("YYYY-MM-DDTHH:mm:ss")
        var end_str = end.format("YYYY-MM-DDTHH:mm:ss")
        var ret = []
        await this.db.plans.where("p_date")
        .between(new Date(start_str), new Date(end_str), true, false)
        .each(function (item) {
            ret.push( item )
        }).catch(function (error) {
            console.error(error);
        });
        var weeks = LibPlan.convert_week_array( this.state.weeks, ret ,moment() ) 
        this.setState({ weeks: weeks })       
        var self = this
        this.db.plans.toArray().then(function (items ) {
            self.setState({ data_org: items })
//console.log( plans )
        });
    }
    tabRow(){
        if(this.state.weeks instanceof Array){
            return this.state.weeks.map(function(object, i){
//console.log( object ,i)
                return (
                    <IndexRow obj={object.weekItem} key={i} />
                )
            })            
        }
    }
    render(){
        return (
        <div className="container">
            <div className="row mt-2">
                <div className="col-md-6">
                    <h3>Plan : {this.state.month_str}</h3>
                </div>
                <div className="col-md-6 btn_move_wrap">
                    <button onClick={this.handleClickBefore} className="btn btn-outline-primary">
                    <i className="fas fa-arrow-circle-left"></i> Before
                    </button>
                    <button onClick={this.handleClickAfter} className="btn btn-outline-primary ml-2">
                        After <i className="fas fa-arrow-circle-right"></i>
                    </button>
                </div>
            </div>
            <hr className="mt-2 mb-2" />            
            <div className="row">
                <div className="col-md-6">
                    <Link to="/plan_create"
                     className="btn btn-sm btn-primary">+ Create
                    </Link>
                </div>
                <div className="col-md-6">
                    <a id="download" href="" download="plan.json" onClick={this.handleClickExport}
                     className="btn btn-outline-primary btn-sm">Export
                    </a> 
                    <Link to="/plan_import" target="_blank"
                     className="btn btn-sm btn-outline-primary ml-2">Import
                    </Link>
                </div>
            </div>
            <table className="table table-bordered mt-2">
                <thead>
                <tr>
                    <th className="th_sun">日</th>
                    <th>月</th>
                    <th>火</th>
                    <th>水</th>
                    <th>木</th>
                    <th>金</th>
                    <th className="th_sat">土</th>
                </tr>      
                </thead>
                <tbody>
                    {this.tabRow()}
                </tbody>
            </table>
        </div>
        )
    }
}

export default Index;

