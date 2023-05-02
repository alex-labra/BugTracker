import { useQuery } from 'react-query';
import { useNavigate } from "react-router-dom";
import api from "./api";
import Navbar from './Navbar';
import ProjectCardList from './Content';

const Dashboard = () => {
    const navigate = useNavigate();

    //validate local token with server
    const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await api.get('/resource', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return true;
            } catch (error) {
                if (error.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    navigate('/');
                }
                return false;
            }
        } else {
            return false;
        }
      }

    const { data: isLoggedIn } = useQuery('isLoggedIn', checkToken);

    //retrieve projects data from API
    const getProjects = async () => {
        const email = localStorage.getItem('email');
        const response = await api.get('/projects', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
                email: email,
            },
        });
        console.log(response.data)
        return response.data;
    }
    
    const { data: projects, isLoading } = useQuery( 'projects', getProjects, {refetchInterval: 3000});
    if (isLoading) {
        <Navbar />
        return<h1>Loading...</h1>
    }
    

    return isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} />
          <ProjectCardList projects={projects} />
        </div>
      ) : (
        navigate('/')
      );
    };


export default Dashboard;