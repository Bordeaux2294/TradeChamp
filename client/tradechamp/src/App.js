import React, { useEffect, useState } from 'react';
import { fetchData, submitData } from './api/apiClient';
import SignIn from './pages/SignIn/SignIn';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
/**
 * The main App component.
 * 
 * This component fetches data when it mounts and provides a button to submit data.
 * It manages the loading state and displays fetched data or a loading message.
 */

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);


  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const result =  await submitData({ key: 'value'});
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  
  // Render the fetched data and provide a button to submit data
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" component={SignIn} />
      </Switch>
    </Router>
  );

};

export default App;