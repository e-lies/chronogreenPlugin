import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, infos: null };
    }
  
    static getDerivedStateFromError(error) {
      // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
      return { hasError: true, error };
    }
  
    componentDidCatch(error, errorInfo) {
      // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.
      return { hasError: true, error, infos:errorInfo }
    }
  
    render() {
      if (this.state.hasError) {
        // Vous pouvez afficher n'importe quelle UI de repli.
      return <h1>Something went wrong. {JSON.stringify(this.state)}</h1>;
      }
  
      return this.props.children;
    }
  }