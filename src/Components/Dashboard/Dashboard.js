import React,{Fragment, useEffect, useState} from 'react';
import './styleDashboard.scss';
import { useHistory } from 'react-router-dom';
import { getToken, getUser, getUrl } from "../../Utils/Common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye } from "@fortawesome/free-solid-svg-icons";
import Search from "../SearchBar/SearchBar";
import ProfilePic from "../Avtar/Avtar";
import Pagination from '../Pagination/Pagination';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import axios from 'axios';

/******************************************
* File: Dashboard.js
* Desc: Display user's activities.
* @param: (1) node id of the document
* @param: (2) title(name) of the document
* @returns: List of user activities.
* @author: Shayane Basu, 06 October 2020
********************************************/

const Dashboard = () => {
  let personId = getUser();
  let history = useHistory();
  // let params = useParams();
  // const id = params.id;
  
  const [ documents , setDocuments ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [skipCount , setSkipCount ] = useState('');
  const [totalitems,settotalitems] =useState('');

  //API call to get the user's activities list.
  useEffect(() => {
    trackPromise(
    axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=0&who=me&maxItems=10`,
    {headers:{
      Authorization: `Basic ${btoa(getToken())}`
    }}).then((response) => {
      setDocuments(response.data.list.entries)
      setMoreItems(response.data.list.pagination.hasMoreItems)
      setSkipCount(response.data.list.pagination.skipCount + 10)
      settotalitems(response.data.list.pagination.totalItems);
    })
    )
  }, []);

  function next(){ //pagination next button
    var localSkipCount = skipCount;
    if (lastButtonClicked === "previous")
     {
      if(totalitems>20){
       if(localSkipCount===0)
         {
          localSkipCount=localSkipCount + 10 
         }else{
          localSkipCount = localSkipCount + 20;}
      }
      else{
      localSkipCount=localSkipCount + 10 ;
    }}
    document.getElementById("myprevBtn").disabled = false;
    axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=${localSkipCount}&who=me&maxItems=10`,
     {headers:{
       Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
       setDocuments(response.data.list.entries)
       setMoreItems(response.data.list.pagination.hasMoreItems)
     if (response.data.list.pagination.hasMoreItems){
      setSkipCount(response.data.list.pagination.skipCount + 10)
      document.getElementById("myBtn").disabled = false;
     }
     else{
      document.getElementById("myBtn").disabled = true;
     }
       setLastButtonClicked("next");
     });
   }

  function previous(){ //pagination previous button
    var localSkipCount = skipCount;
    if (lastButtonClicked === "next") {
      if(localSkipCount===10){
        localSkipCount = localSkipCount - 10;
      }
      else{
     localSkipCount = localSkipCount - 20;}
    }
    document.getElementById("myBtn").disabled = false;
    axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=${localSkipCount}&who=me&maxItems=10`,
      {headers:{
        Authorization: `Basic ${btoa(getToken())}`
      }}).then((response) => {
        setDocuments(response.data.list.entries)
        setMoreItems(response.data.list.pagination.hasMoreItems)
        if (response.data.list.pagination.skipCount > 0)
        {
          setSkipCount(response.data.list.pagination.skipCount - 10)
          document.getElementById("myprevBtn").disabled = false;
        }
        else{
          document.getElementById("myprevBtn").disabled = true;
        }
        setLastButtonClicked("previous")
      });
   }

  /********  
  This function will create the url for each document like 
  'https://systest.eisenvault.net/document-details/123456789/example.pdf'
  ********/
  function handleDocument(id,title){
    history.push(`/document-details/${id}/${title}`)
  }

  /* In case the activity is one of the value from this array,
   the preview icon will not be displayed in front of that activity */

  const noPreviewIcon = ["file-deleted", "user-role-changed", 
                        "folders-deleted", "folder-added"]

  return (
  <Fragment>

      <div id="second_section">

      <div className="title">

        <h2>Dashboard</h2>
        <ProfilePic />
        </div>

        <div className="search-profile">
        <Search />
      </div>
      
      <div className="filesDetail">
        <h3>My Recent Activities</h3>

        <table className='documentsList'
        id='docDetails'>
            {documents.map(document => (              
            <tbody key={document.entry.id}>
                <tr id='tableRow'>

                  {/* To display the filename with department name. */}
                  <td className='fileName' 
                  id='fileTitle'>                             
                    <FontAwesomeIcon icon={faFile} />
                        <h4>
                          {document.entry.activitySummary.title} 
                        </h4> 
                        <p className="text">{ " " }in { " " }</p> 
                          <h4>{document.entry.siteId}</h4> 
                          </td>

                          {/* To display the activity date. */}
                          <td className='fileDetails'>
                            {document.entry.postedAt.split('T')[0]} </td>

                          {/* To display the activity. */}
                          <td className='fileActivity'>
                            {document.entry.activityType.split('.')[3]}</td>

                          {/* The eye icon to view the file. */}
                            {noPreviewIcon.includes(document.entry.activityType.split('.')[3])?
                            "":<td className='view'
                            onClick={() => handleDocument(
                              document.entry.activitySummary.objectId,
                              document.entry.activitySummary.title ) }>
                                <FontAwesomeIcon icon={faEye} /></td>}
                      </tr>
                  </tbody>
            ))}
        </table>
        <LoadingIndicator/> 
      </div>
  </div>
  
    <div className="col-md-6">
     <Pagination
     handlePrev={previous}
     handleNext={next}/>  
    </div>

  </Fragment>
  )
};

export default Dashboard;