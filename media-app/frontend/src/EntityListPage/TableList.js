import GenericTable from './GenericTable';
import { Card, CardBody } from "@nextui-org/react";

const ERDiagram = () => {
    return (
        <Card>
            <CardBody>
                ERDIAGRAM
            </CardBody>
        </Card>  
    )
};

const CommentTable = () => {
    return <GenericTable apiEndpoint="api/comment" title="Comment Table" />;
};

const EventTable = () => {
    return <GenericTable apiEndpoint="api/event" title="Event Table" />;
};

const FriendshipTable = () => {
    return <GenericTable apiEndpoint="api/friendship" title="Friendship Table" />;
};

const GroupMemTable = () => {
    return <GenericTable apiEndpoint="api/groupmembership" title="Group Membership Table" />;
};

const GroupTable = () => {
    return <GenericTable apiEndpoint="api/group" title="Group Table" />;

};

const LikeTable = () => {
    return <GenericTable apiEndpoint="api/like" title="Like Table" />;
};

const MediaTable = () => {
    return <GenericTable apiEndpoint="api/media" title="Media Table" />;
};

const MessageTable = () => {
    return <GenericTable apiEndpoint="api/message" title="Message Table" />;
};

const PostTable = () => {
    return <GenericTable apiEndpoint="api/post" title="Post Table" />;
};

const TagTable = () => {
    return <GenericTable apiEndpoint="api/tag" title="Tag Table" />;
};

const UserTable = () => {
    return <GenericTable apiEndpoint="allUsers" title="User Table" />;
};

export {
    ERDiagram,
    CommentTable,
    EventTable,
    FriendshipTable,
    GroupMemTable,
    GroupTable,
    LikeTable,
    MediaTable,
    MessageTable,
    PostTable,
    TagTable,
    UserTable,
};