import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import IndexRow from './IndexRow';
import Dexie from 'dexie';
import $ from  'jquery'
import LibTodo from '../../libs/LibTodo';
import LibDexie from '../../libs/LibDexie';

//
class Index extends Component {
    constructor(props) {
        super(props);
//        this.state = {data: ''}
        this.state = {data: '', type: 0, items_org: [] }
        this.db = null
        this.handleClickExport = this.handleClickExport.bind(this);
        this.handleClickTypeNone = this.handleClickTypeNone.bind(this);
        this.handleClickTypeComplete = this.handleClickTypeComplete.bind(this);
    }
    componentDidMount(){
        var config = LibTodo.get_const()
        this.db = new Dexie( config.DB_NAME );
        this.db.version(config.DB_VERSION).stores( config.DB_STORE );
        this.get_items(0)                
    }
    handleClickTypeComplete(){
        this.setState({ type: 1 })
// console.log(this.state.type )
        this.get_items(1)
        this.change_complete_tab(1)
    }
    change_complete_tab(type){
        $('#nav_complete_none_tab').removeClass('active');
        $('#nav_complete_tab').removeClass('active');
        if(type === 1){
            $('#nav_complete_tab').addClass('active');
        }else{
            $('#nav_complete_none_tab').addClass('active');
        }
    }
    handleClickTypeNone(){
        this.setState({ type: 0 })
// console.log(this.state.type )
        this.get_items(0)
        this.change_complete_tab(0)
    }
    handleClickExport(){
        console.log("#-handleClickExport")
        var content = JSON.stringify( this.state.items_org );
// console.log(content)
        var blob = new Blob([ content ], { "type" : "application/json" });
        var fname = "todos.json"
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
    async get_items(type){
console.log( type )
        var self = this
        var data = []
        await this.db.todos.where({complete: type }).each(function (item) {
//                console.log(item);
            data.push( item )
        }).catch(function (error) {
            console.error(error);
        });    
        var tasks = LibDexie.get_reverse_items(data) 
        self.setState({ data: tasks })    
        this.db.todos.toArray().then(function (items ) {
//            var items_all = LibDexie.get_reverse_items(items)
            self.setState({ items_org: items })
//console.log( items )
        });
        /*
        */
    }
    tabRow(){
        if(this.state.data instanceof Array){
            return this.state.data.map(function(object, i){
            return <IndexRow obj={object} key={i} />
            })
        }
    }
    render(){
        return (
        <div className="container">
            <h3>Todo - index</h3>
            <div className="row">
                <div className="col-md-6">
                    <Link to="/todo_create"
                     className="btn btn-sm btn-primary">+ Create
                    </Link>
                </div>
                <div className="col-md-6">
                    <a id="download" href="" download="todos.json" onClick={this.handleClickExport}
                     className="btn btn-outline-primary btn-sm">Export
                    </a> 
                    <Link to="/todo_import"  target="_blank"
                     className="btn btn-sm btn-outline-primary ml-2">Import
                    </Link>
                </div>
            </div><br />
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className="nav-link active" id="nav_complete_none_tab"
                    onClick={this.handleClickTypeNone} >
                        未完
                    </button>                    
                </li>
                <li className="nav-item">
                    <button className="nav-link" id="nav_complete_tab"
                    onClick={this.handleClickTypeComplete} >
                        完了
                    </button>                    
                </li>
            </ul>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
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

