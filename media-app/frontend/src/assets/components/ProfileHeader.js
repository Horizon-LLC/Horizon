

const ProfileHeader = (username, toggleMenu, totalPosts, totalFollowers, totalFollowing, totalFriends) => {
    return(
        <div className="profile-head">
                    <div className="pfp">
                        <img src={defaultProfilePic} alt="Profile" />
                    </div>
                    <div className="info">
                        <span className="username-text">{username}</span>
                        <button className="settings-button" onClick={toggleMenu}>
                            &#9776;
                        </button>
                        <div className="info-line">
                            <span className="info-text">{totalPosts} Posts</span>
                            <span className="info-text">{totalFollowers} Followers</span>
                            <span className="info-text">{totalFollowing} Following</span>
                            <Button color="primary" variant="light" className="info-text" onClick={onFriendsOpen} style={{ cursor: 'pointer' }}>
                            {totalFriends} Friends
                            </Button>
                        </div>
                        <div className="bio">{bio}</div>
                    </div>
                </div>
    );
};