import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
	return (
	<nav>
		<br/><br/>
		<center><h2 className="notFound"> Erreur ! Cette page n'existe pas !  </h2></center>
		<Link to="/siraj/vendeur"> Revenir au login  </Link>
    </nav>
	)
}

export default NotFound;