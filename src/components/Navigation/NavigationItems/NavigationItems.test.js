import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()});//Connecting enzyme

describe('Testing <NavigationItems />',() => {

    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    })

    it('Should render 2 <NavigationItem /> components if unauthenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2); 
    })
    it('Should render 3 <NavigationItem /> components if authenticated', () => {
        wrapper.setProps({isAuthenticated: true})
        expect(wrapper.find(NavigationItem)).toHaveLength(3); 
    })
    it('Should render a <NavigationItem /> that has a logout link if authenticated', () => {
        wrapper.setProps({isAuthenticated: true})
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true); 
    })
});

//describe(), it() and expect() are all globally available due to Jest.