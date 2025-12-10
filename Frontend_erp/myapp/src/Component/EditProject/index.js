import {Component} from  "react";
import { TailSpin } from 'react-loader-spinner';
import Navbar from "../Navbar";
import "./index.css";

const pageStates = {
    start : 'START',
    loading : 'LOADING',
    end: 'END',
    error: 'ERROR',
};



class EditProject extends Component {

        constructor(props){
        super(props);
        this.state = {
            name : '',
            progress : '',
            spent : '',
            status : '',
            budget : '',
            pageState: pageStates.start,
        };
    }


    componentDidMount(){    
        this.getData();
    }

    getData = async () => { 
        const { match } = this.props;
        const { id } = match.params;
        this.setState({pageState: pageStates.loading});
        try{
        const response = await fetch(`http://localhost:5000/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        if (response.ok) {  
            console.log(data);
            const requiredProject = data.projects.find(proj => proj.id === parseInt(id));
            console.log(requiredProject);
            const {name, progress, spent, status , budget} = requiredProject;
            this.setState({pageState: pageStates.end , name , progress , spent , status , budget});
        }
        else{
            this.setState({pageState: pageStates.error});
        }
    } catch (err) {
        console.error("Error fetching project data:", err);
        this.setState({pageState: pageStates.error});
    }
    };

    onEditDone = async (event) => {
        event.preventDefault();
        const { match } = this.props;
        const { id } = match.params;
        const { name, progress, spent, status , budget } = this.state;
        try {
            const response = await fetch(`http://localhost:5000/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, progress, spent, status , budget }),
            } ,  alert("Project updated successfully!"));
            const data = await response.json();
            if (response.ok) {
               alert("Project updated successfully!");
            } else {
                alert("Failed to update project: " + data.error);
            }
        } catch (err) {
            console.error("Error updating project:", err);
            alert("An error occurred while updating the project.");
        }
    };


    switching = () => { 
            const {pageState} = this.state;
            switch(pageState) {
                    case pageStates.start:
                        return (
                            <div className='loading-at-center'>
                                <div>
                                    <TailSpin
                                        height="80"
                                        width="80"
                                        color="#273eafff"
                                        ariaLabel="tail-spin-loading"
                                        visible={true}
                                    />
                                </div>
                            </div>
                        );
                    case pageStates.loading:
                         return (
                            <div className='loading-at-center'>
                                <div>
                                    <TailSpin
                                        height="80"
                                        width="80"
                                        color="#273eafff"
                                        ariaLabel="tail-spin-loading"
                                        visible={true}
                                    />
                                </div>
                            </div>
                        );
                    case pageStates.end:
                        return this.renderingprojectDetailsToEdit();
                    default:
                        return <h1>something went wrong</h1>;
                }
        };

        renderingprojectDetailsToEdit = () => {
           const {name, progress, spent, status,budget } = this.state;
              return(
            <div>
                <div className="edit-project-details-container">
                    <h2 className="edit-page-heading">Edit Project Details</h2>
                    <form className="edit-form" onSubmit={this.onEditDone}>
                        <label className="edit-label" htmlFor="name">Project Name:</label>
                       
                        <input className="edit-input" type="text" id="name" value={name} onChange={(e) => this.setState({name: e.target.value})} />

                        <label className="edit-label" htmlFor="budget">Budget (₹):</label>
                       
                        <input className="edit-input" type="number" id="budget" value={budget} onChange={(e) => this.setState({budget: e.target.value})} /> 
                       
                        <label className="edit-label" htmlFor="progress">Progress (%):</label>
                       
                        <input className="edit-input" type="number" id="progress" value={progress} onChange={(e) => this.setState({progress: e.target.value})} />   
                     
                        <label className="edit-label" htmlFor="spent">Amount Spent (₹):</label>
                        
                        <input className="edit-input" type="number" id="spent" value={spent} onChange={(e) => this.setState({spent: e.target.value})} />
                      
                        <label className="edit-label" htmlFor="status">Status:</label>
                        
                        <input className="edit-input" type="text" id="status" value={status} onChange={(e) => this.setState({status: e.target.value})} />
                       
                        <button type="submit" className="save-button">Save Changes</button>
                    </form>
                </div>
            </div>
        );
        }

    render(){
        return(
            <div>
                <div className="nav-ba">
                    <Navbar />
                </div>
                {this.switching()}
            </div>
        )
    }
}

export default EditProject;