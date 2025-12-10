import {Component} from  "react";
import Navbar from "../Navbar";
import "./index.css";


class AddOneProject extends Component {

        constructor(props){
        super(props);
        this.state = {
            name : '',
            progress : '',
            spent : '',
            status : '',
            budget : '',
        };
    }


    onDone = async (event) => {
        event.preventDefault();
        const { name, progress, spent, status , budget } = this.state;
        try {
            const response = await fetch(`http://localhost:5000/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, progress, spent, status , budget }),
            } , alert("Project Added successfully!"));
            const data = await response.json();
            alert("Project Added successfully!");
            if (response.ok) {
               alert("Project Added successfully!");
            } else {
                alert("Failed to add project: " + data.error);
            }
        } catch (err) {
            console.error("Error adding project:", err);
            alert("An error occurred while adding the project.");
        }
    };


        renderingprojectAdd = () => {
           const {name, progress, spent, status,budget } = this.state;
              return(
            <div>
                <div className="edit-project-details-container">
                    <h2 className="edit-page-heading">Add Project Details</h2>
                    <form className="edit-form" onSubmit={this.onDone}>
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
                       
                        <button type="submit" className="save-button">Add project</button>
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
                {this.renderingprojectAdd()}
            </div>
        )
    }
}

export default AddOneProject;