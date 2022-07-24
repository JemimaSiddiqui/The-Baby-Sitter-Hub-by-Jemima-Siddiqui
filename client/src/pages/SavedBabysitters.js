import React from 'react';
import { Row, Container, Col, Card, CardTitle, CardBody, CardText, Button, CardImg } from 'reactstrap';

import Auth from '../utils/auth';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_SAVED_BABYSITTER } from '../utils/mutations'
import { QUERY_ME } from '../utils/queries'

const SavedBabysitters = () => {
  const [removeSavedBabysitter, { error }] = useMutation(REMOVE_SAVED_BABYSITTER);
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData?.email) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBabysitter = async (babysitterId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {

      await removeSavedBabysitter({
        variables: { babysitterId }
      });

      if (error) {
        throw new Error('something went wrong!');
      }
      window.location.reload()
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Container>
        <Row>
          <h2>
            {userData.savedBabysitters?.length
              ? `Viewing ${userData.savedBabysitters.length} saved ${userData.savedBabysitters.length === 1 ? 'babysitter' : 'babysitters'}:`
              : 'You have no saved babysitters!'}
          </h2>
        </Row>
        <Row xs="1" sm="1" md="2">
          {userData.savedBabysitters.map((babysitter) => {
            
              return (
              <Col>
              <Card key={babysitter._id} border='dark' className="card">
                {babysitter.babysitterPic ? <CardImg src={babysitter.babysitterPic} alt={`The cover for ${babysitter.babysitterAuthor}`} className="img" variant='top' /> : null}
                <CardBody>
                  <CardTitle>
                    Name:  {babysitter.babysitterAuthor}
                  </CardTitle>
                  <CardText>{babysitter.babysitterAbout}</CardText>
                  <Button className='btn' onClick={() => handleDeleteBabysitter(babysitter._id)}>
                    Delete this babysitter!
                  </Button>
                </CardBody>
              </Card>
              </Col>
              );
            
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBabysitters;
