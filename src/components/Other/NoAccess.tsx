import { Container, Row, Col, Button } from 'react-bootstrap';

function NoAccess(){
    return(
        <Container className="text-center mt-5 not-found p-3">
            <Row>
                <Col>
                    <h1 className="display-1 text-danger">Access Denied</h1>
                    <h2>Page Not Found</h2>
                    <p className="lead">
                        Sorry, looks like you don't have access to this page. Feel free to sign in or register to gain access. 
                    </p>
                    <Button variant="primary" href="/" className="m-3">
                        Go Back Home
                    </Button>
                    <Button variant='secondary' href='/login' className='m-3'>
                        Sign In | Register
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default NoAccess;