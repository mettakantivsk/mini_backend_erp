import { Component } from "react";
import { TailSpin } from 'react-loader-spinner';
import { FiEdit } from "react-icons/fi";
import Navbar from "../Navbar";
import "./index.css";

const pageStates = {
    start : 'START',
    loading : 'LOADING',
    end: 'END',
    error: 'ERROR',
};


class Project extends Component {
    constructor(props){
        super(props);
        this.state = {
            project: {},
            pageState: pageStates.start,
        };
    }


    getData = async () => {
        this.setState({pageState: pageStates.loading});
        const { match } = this.props;
        const { id } = match.params;
        
        try {
            let response = await fetch(`http://localhost:5000/ai/project-risk/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            let data = await response.json();
            if (response.ok) {
                const project= {
                    budget: data.budget,
                    progress:data.progress,
                    projectId: data.projectId,
                    riskLevel:data.risk_level,
                    riskScore:data.risk_score,
                    spent: data.spent,
                }
                this.setState({project, pageState: pageStates.end});
            }
        } catch(err) {
            console.error("Error fetching projects:", err);
            this.setState({pageState: pageStates.error});
        }
    };

    componentDidMount(){
        this.getData();
    }

    editClicked = ()=>{
        const { history } = this.props;
        const { project } = this.state;
        history.push(`/projects/edit/${project.projectId}`);
    }

    renderingprojectDetails = () => {
        const { project } = this.state;
        const { budget, progress , projectId, riskLevel,riskScore, spent } = project;
        return (
            <div className="Risk-management">
                <Navbar />
                <h2>See the riskLevel of this project</h2>
                <div className="project-details">
                    <h3 className='li-name'> project ID: {projectId}</h3>
                    <p className='li-budget'>Budget: ₹{budget}</p>
                    <p className='li-spent'>Spent: ₹{spent}</p>
                    <p className='li-progress'>Progress: {progress}%</p>
                    <p className='li-status'>Risk level: {riskLevel}</p>
                    <p className='li-status'>Risk Score: {riskScore}</p>
                    <div className="d-last">
                        <button type="button" className="btnn-edit" onClick={this.editClicked}><FiEdit /></button>
                    </div>
                </div>
            </div>
        );
    }

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
                        return this.renderingprojectDetails();
                    default:
                        return <h1>something went wrong</h1>;
                }
        };

  render() {
    return (
      <div className="project-container">
        {this.switching()}
        </div>
    );
    }
}

export default Project;