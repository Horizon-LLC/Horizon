import './MainPage.css'
import {Button, Card, CardBody, CardHeader, Input, Spacer} from "@nextui-org/react";

const UserMainPage = () => {
    return (
        <div className='container'>
            <Card className='card-container'>
                <Button color="primary" className="max-w-xs">
                    List
                </Button>
            </Card>
            <Spacer x={5} />
            <Card className='card-container'>
                <Button color="primary" className="max-w-xs">
                    Create Post
                </Button>
            </Card>
            <Spacer x={5} />
            <Card className='card-container'>
                <Button color="primary" className="max-w-xs">
                    User Page
                </Button>
            </Card>
        </div>
    )
};

export default UserMainPage;