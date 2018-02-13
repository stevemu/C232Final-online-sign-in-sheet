import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom'
import {connect} from 'react-redux';
import WebFont from 'webfontloader';
import styled from 'styled-components';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RecordsScreen from './screens/RecordsScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import RegSuccessScreen from './screens/RegSuccessScreen';


WebFont.load({
    google: {
        families: ['Droid Sans', 'Droid Serif']
    }
});


const PrivateRoute = ({authed, component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            authed ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: "/login",
                    state: {from: props.location}
                }}
                />
            )
        )}
        />
    )
};

// only render after rehydrated
const HydrateRoute = ({hydrated, component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => {

            if (hydrated) {
                return (
                    <Component {...props} />
                )
            }

            return (
                <div>rehydrating...</div>
            )
        }}

        />
    )
};

const AppContainer = styled.div`
  font-family: "Droid Sans"
`;

@connect(store => {
    return {
        authed: store.loginUser.authenticated,
        hydrated: store.app.hydrated,
    }
})
class App extends Component {
    constructor() {
        super();
    }

    render() {
        const {authed, hydrated} = this.props;

        return (
            <Router>
                <AppContainer>
                    <Route exact path="/" render={(props)=> {
                        return (
                            <Redirect to="/login" />
                        )
                    }}/>

                    <Route path="/login" component={LoginScreen}/>

                    <PrivateRoute authed={authed}
                                  path="/records/"
                                  component={RecordsScreen}/>

                    <Route path="/registration" component={RegistrationScreen}/>

                    {/*rehydrate then render RegSuccess, because this screen reset the regSuccess state to null*/}
                    <HydrateRoute hydrated={hydrated} path="/reg-success" component={RegSuccessScreen}/>

                </AppContainer>
            </Router>
        );
    }
}

export default App;
