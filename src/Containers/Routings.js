import React, { Fragment } from "react";
import { Route, withRouter } from "react-router-dom";
// import LoginRoutings from './LoginRoutings';
import LoginPage from "../Components/Login/Login"
import NavigationItems from "../Components/Navigation/NavigationItems/NavigationItems";
import MobileMenu from "../Components/MobileMenu/MobileMenu";

import MyUploads from "../Components/MyUploads/MyUploads";
import Dashboard from "../Components/Dashboard/Dashboard";
import documentsList from "../Components/Documents/DocumentList";

import TrashDisplayFiles from "../Components/Trash/TrashDisplay"

import ManageShares from "../Components/ManageShares/ManageShares";

import './styles.scss';


// const Routings = withRouter(({location}) => {
//   return  <Router>

//     {/* <Switch> */}

//     <Route exact path="/" component={LoginPage} />
//     <Route>
//     {location.pathname !== '/' && <NavigationItems />} 
//     </Route>
    
//     <div>
//     <MobileMenu />
//     </div>
    
//     <div className="main_body">

//         {/* <NavigationItems /> */}
//         <Route path="/dashboard" exact component ={Dashboard} />
//         <Route path="/documentsList" component={documentsList} />
//         <Route path="/myUploads" component={MyUploads} />

//         <Route path="/trashDisplay" component={TrashDisplayFiles} />

//         <Route path="/manageShares" component={ManageShares} />

//     </div>
//    {/* </Switch> */}
//   </Router>;
// })

const Routings = withRouter (({ location }) => {
  return(
    <Fragment>
        <Route exact path="/" component={LoginPage} />
      <div>
        {location.pathname !== '/' && <MobileMenu />} 
      </div>
      <div className="main_body">
        {location.pathname !== '/' && <NavigationItems /> }

        <Route path="/dashboard" exact component ={Dashboard} />
        <Route path="/documentsList" component={documentsList} />
        <Route path="/myUploads" component={MyUploads} />
        <Route path="/trashDisplay" component={TrashDisplayFiles} />
        <Route path="/manageShares" component={ManageShares} />
      </div>
    </Fragment>
  )
}
)

export default Routings;
