import {Component} from 'react';
import {Link} from 'react-router-dom'; 
import { TailSpin } from 'react-loader-spinner';
import { RiDeleteBinLine } from "react-icons/ri";
import Navbar from '../Navbar';
import "./index.css";

const pageStates = {
    start : 'START',
    loading : 'LOADING',
    end: 'END',
    error: 'ERROR',
};

const BuildingProjectBlocks = (props) => {
    const {project , deleteing} = props;

    const deleteOn = ()=>{
        deleteing(project.id);
    }

    return(
        <li className="project-block">
            <Link  to={`/projects/${project.id}`} className="project-link">
            <h3 className='li-name'>{project.name}</h3>
            <p className='li-budget'>Budget: ₹{project.budget}</p>
            <p className='li-spent'>Spent: ₹{project.spent}</p>
            <p className='li-progress'>Progress: {project.progress}%</p>
            <p className='li-status'>Status: {project.status}</p>
            </Link>
            <div className='d-last dlete-line'>
                <button className="btn-delete" onClick={deleteOn}><RiDeleteBinLine /></button>
            </div>
        </li>
    )
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [] , 
            pageState: pageStates.start,
        };
    }

    onDeleteRequest = async (idd)=>{
        await fetch(`http://localhost:5000/projects/${idd}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        } , alert("Project Deleted Successfully"),this.getData());
    }

    getData = async () => {
        this.setState({pageState: pageStates.loading});
        
        try {
            let response = await fetch("http://localhost:5000/projects", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            let data = await response.json();
            console.log(data);
            if (response.ok) {
                const {projects} = data;
                this.setState({projects: projects, pageState: pageStates.end});
            }
        } catch(err) {
            console.error("Error fetching projects:", err);
            this.setState({pageState: pageStates.error});
        }
    };

    componentDidMount(){
        this.getData();
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
                    return this.projectsPage();
                default:
                    return <h1>something went wrong</h1>;
            }
    };

    projectsPage = () => {
        const {projects} = this.state;
        return(
            projects.length === 0 ? this.noProjectsView() :
            <div>
                <Navbar />
                <h2>Welcome to the projects page</h2>
                <h3>Currently we have this projects</h3>
                <ul>
                    {projects.map((project) => (
                        <BuildingProjectBlocks key={project.id} project={project} deleteing={this.onDeleteRequest} />
                    ))}
                </ul>
            </div>
        )
    };

    noProjectsView = () => (
        <div>
            <Navbar />
            <div className="no-projects-view">
                <h1 className="no-projects-heading">No Projects Found</h1>
                <p className="no-projects-description">You can add a new project by clicking the button below</p>
                <Link to="/addproject">
                    <button className="add-project-button" type="button">Add Project</button>
                </Link>
            </div>
        </div>
    );

    render() {
            return (
                <div className="home-container">
                    {this.switching()}
                </div>
            );
    }
}                       
export default Home;
