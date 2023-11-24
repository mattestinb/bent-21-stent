import React from 'react';
import { ReactDOM } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from "./pages/SignUp.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import OrderHistory from "./pages/orderHistory"
import Detail from "./pages/Detail"
import Checkout from "./pages/checkout/Checkout.js";
import Nav from "./components/Nav";
import { StoreProvider } from './utils/GlobalState';

function App() {
  const httpLink = createHttpLink({
    uri: '/graphql',
  });
  
  const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem('id_token');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (  
  
  <ApolloProvider client={client}>

  <Router>
  <div>
          <StoreProvider>
            <Nav />
        <Routes>

         <Route path="/" element={<Home />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/Signup" element={<SignUp />} />
         <Route path="/Checkout" element={<Checkout />} />
          <Route path="/OrderHistory" element={<OrderHistory />} /> 
          <Route 
                path="/products/:id" 
                element={<Detail />} 
              />
        </Routes>
        </StoreProvider>
        </div>
      </Router>
  
   </ApolloProvider>
 )
}
export default App;
