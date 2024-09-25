//TODO need to replace with notification
// import GroupRoleTable from './GroupRoleTable';
import {CommentTable, UserTable, ERDiagram, FriendshipTable, MessageTable, GroupTable, 
    GroupMemTable, PostTable, LikeTable, MediaTable, EventTable, TagTable} from './TableList';
import {Tabs, Tab} from "@nextui-org/react";

const EntityList = () => {
    return (
        <div>
             <Tabs aria-label="Options">
                <Tab key="erdiag" title="ER Diagram">
                    <ERDiagram />
                </Tab>
                <Tab key="user" title="User">
                    <UserTable />
                </Tab>
                <Tab key="friendship" title="Friendship">
                    <FriendshipTable />
                </Tab>
                <Tab key="message" title="Message">
                    <MessageTable />
                </Tab>
                <Tab key="group" title="Group">
                    <GroupTable />
                </Tab>
                {/* TODO need to replace with notification*/}
                {/*<Tab key="grouprole" title="Group Role">*/}
                {/*    <GroupRoleTable />*/}
                {/*</Tab>*/}
                <Tab key="groupmem" title="Group Membership">
                    <GroupMemTable />
                </Tab>
                <Tab key="post" title="Post">
                    <PostTable />
                </Tab>
                <Tab key="like" title="Like">
                    <LikeTable />
                </Tab>
                <Tab key="comment" title="Comment">
                    <CommentTable />
                </Tab>
                <Tab key="media" title="Media">
                    <MediaTable />
                </Tab>
                <Tab key="event" title="Event">
                    <EventTable />
                </Tab>
                <Tab key="tag" title="Tag">
                    <TagTable />
                    </Tab>
            </Tabs>

        </div>
    )
};


export default EntityList;
