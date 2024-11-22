from typing import List, Optional

from sqlalchemy import Date, DateTime, ForeignKeyConstraint, Index, Integer, String, Text
from sqlalchemy.dialects.mysql import TINYINT, VARCHAR
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Base(DeclarativeBase):
    __abstract__ = True  


class Chatbox(Base):
    __tablename__ = 'chatbox'
    __table_args__ = (
        Index('fk_user1', 'user_id_1'),
        Index('fk_user2', 'user_id_2')
    )

    chatbox_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id_1: Mapped[int] = mapped_column(Integer)
    user_id_2: Mapped[int] = mapped_column(Integer)
    content: Mapped[Optional[str]] = mapped_column(VARCHAR(100))
    is_read: Mapped[Optional[int]] = mapped_column(TINYINT(1))

    message: Mapped[List['Message']] = relationship('Message', back_populates='chatbox')


class User(Base):
    __tablename__ = 'user'

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(50))
    last_name: Mapped[Optional[str]] = mapped_column(String(50))
    profile_pic: Mapped[Optional[str]] = mapped_column(String(255))
    username: Mapped[Optional[str]] = mapped_column(String(30))
    email: Mapped[Optional[str]] = mapped_column(String(100))
    date_of_birth: Mapped[Optional[datetime.date]] = mapped_column(Date)
    is_verified: Mapped[Optional[int]] = mapped_column(TINYINT(1))
    password: Mapped[Optional[str]] = mapped_column(String(255))
    location: Mapped[Optional[str]] = mapped_column(String(100))
    security_question: Mapped[Optional[str]] = mapped_column(String(255))
    security_answer: Mapped[Optional[str]] = mapped_column(String(255))

    friendship: Mapped[List['Friendship']] = relationship('Friendship', foreign_keys='[Friendship.user_id_1]', back_populates='user')
    friendship_: Mapped[List['Friendship']] = relationship('Friendship', foreign_keys='[Friendship.user_id_2]', back_populates='user_')
    group: Mapped[List['Group']] = relationship('Group', back_populates='user')
    message: Mapped[List['Message']] = relationship('Message', foreign_keys='[Message.receiver_id]', back_populates='receiver')
    message_: Mapped[List['Message']] = relationship('Message', foreign_keys='[Message.sender_id]', back_populates='sender')
    notification: Mapped[List['Notification']] = relationship('Notification', back_populates='user')
    post: Mapped[List['Post']] = relationship('Post', back_populates='user')
    comment: Mapped[List['Comment']] = relationship('Comment', back_populates='user')
    event: Mapped[List['Event']] = relationship('Event', back_populates='user')
    groupmembership: Mapped[List['Groupmembership']] = relationship('Groupmembership', back_populates='user')
    media: Mapped[List['Media']] = relationship('Media', back_populates='user')
    tag: Mapped[List['Tag']] = relationship('Tag', back_populates='tagged_user')
    like: Mapped[List['Like']] = relationship('Like', back_populates='user')


class Friendship(Base):
    __tablename__ = 'friendship'
    __table_args__ = (
        ForeignKeyConstraint(['user_id_1'], ['user.user_id'], name='friendship_ibfk_1'),
        ForeignKeyConstraint(['user_id_2'], ['user.user_id'], name='friendship_ibfk_2'),
        Index('user_id_1', 'user_id_1'),
        Index('user_id_2', 'user_id_2')
    )

    friendship_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id_1: Mapped[Optional[int]] = mapped_column(Integer)
    user_id_2: Mapped[Optional[int]] = mapped_column(Integer)
    status: Mapped[Optional[int]] = mapped_column(TINYINT(1))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    user: Mapped['User'] = relationship('User', foreign_keys=[user_id_1], back_populates='friendship')
    user_: Mapped['User'] = relationship('User', foreign_keys=[user_id_2], back_populates='friendship_')


class Group(Base):
    __tablename__ = 'group'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='group_ibfk_1'),
        Index('user_id', 'user_id')
    )

    group_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    visibility: Mapped[Optional[str]] = mapped_column(String(20))
    members: Mapped[Optional[int]] = mapped_column(Integer)
    cover_photo: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped['User'] = relationship('User', back_populates='group')
    event: Mapped[List['Event']] = relationship('Event', back_populates='group')
    groupmembership: Mapped[List['Groupmembership']] = relationship('Groupmembership', back_populates='group')


class Message(Base):
    __tablename__ = 'message'
    __table_args__ = (
        ForeignKeyConstraint(['chatbox_id'], ['chatbox.chatbox_id'], name='fk_chatbox_id'),
        ForeignKeyConstraint(['receiver_id'], ['user.user_id'], name='message_ibfk_2'),
        ForeignKeyConstraint(['sender_id'], ['user.user_id'], name='message_ibfk_1'),
        Index('fk_chatbox_id', 'chatbox_id'),
        Index('receiver_id', 'receiver_id'),
        Index('sender_id', 'sender_id')
    )

    message_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sender_id: Mapped[Optional[int]] = mapped_column(Integer)
    receiver_id: Mapped[Optional[int]] = mapped_column(Integer)
    content: Mapped[Optional[str]] = mapped_column(String(1000))
    is_read: Mapped[Optional[int]] = mapped_column(TINYINT(1))
    chatbox_id: Mapped[Optional[int]] = mapped_column(Integer)
    time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    chatbox: Mapped['Chatbox'] = relationship('Chatbox', back_populates='message')
    receiver: Mapped['User'] = relationship('User', foreign_keys=[receiver_id], back_populates='message')
    sender: Mapped['User'] = relationship('User', foreign_keys=[sender_id], back_populates='message_')


class Notification(Base):
    __tablename__ = 'notification'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='notification_ibfk_1'),
        Index('user_id', 'user_id')
    )

    notification_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    type: Mapped[Optional[str]] = mapped_column(String(50))
    content: Mapped[Optional[str]] = mapped_column(Text)
    is_read: Mapped[Optional[int]] = mapped_column(TINYINT(1))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    user: Mapped['User'] = relationship('User', back_populates='notification')


class Post(Base):
    __tablename__ = 'post'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='post_ibfk_1'),
        Index('user_id', 'user_id')
    )

    post_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    media_id: Mapped[Optional[int]] = mapped_column(Integer)
    content: Mapped[Optional[str]] = mapped_column(Text)
    visibility: Mapped[Optional[str]] = mapped_column(String(20))
    tagged_users: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    user: Mapped['User'] = relationship('User', back_populates='post')
    comment: Mapped[List['Comment']] = relationship('Comment', back_populates='post')
    media: Mapped[List['Media']] = relationship('Media', back_populates='post')
    tag: Mapped[List['Tag']] = relationship('Tag', back_populates='post')
    like: Mapped[List['Like']] = relationship('Like', back_populates='post')


class Comment(Base):
    __tablename__ = 'comment'
    __table_args__ = (
        ForeignKeyConstraint(['post_id'], ['post.post_id'], name='comment_ibfk_2'),
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='comment_ibfk_1'),
        Index('post_id', 'post_id'),
        Index('user_id', 'user_id')
    )

    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    post_id: Mapped[Optional[int]] = mapped_column(Integer)
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    parent_comment_id: Mapped[Optional[int]] = mapped_column(Integer)
    is_edited: Mapped[Optional[int]] = mapped_column(TINYINT(1))

    post: Mapped['Post'] = relationship('Post', back_populates='comment')
    user: Mapped['User'] = relationship('User', back_populates='comment')
    like: Mapped[List['Like']] = relationship('Like', back_populates='comment')


class Event(Base):
    __tablename__ = 'event'
    __table_args__ = (
        ForeignKeyConstraint(['group_id'], ['group.group_id'], name='event_ibfk_2'),
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='event_ibfk_1'),
        Index('group_id', 'group_id'),
        Index('user_id', 'user_id')
    )

    event_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    group_id: Mapped[Optional[int]] = mapped_column(Integer)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    end_time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    group: Mapped['Group'] = relationship('Group', back_populates='event')
    user: Mapped['User'] = relationship('User', back_populates='event')


class Groupmembership(Base):
    __tablename__ = 'groupmembership'
    __table_args__ = (
        ForeignKeyConstraint(['group_id'], ['group.group_id'], name='groupmembership_ibfk_2'),
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='groupmembership_ibfk_1'),
        Index('group_id', 'group_id'),
        Index('user_id', 'user_id')
    )

    group_membership_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    group_id: Mapped[Optional[int]] = mapped_column(Integer)
    role: Mapped[Optional[str]] = mapped_column(String(50))

    group: Mapped['Group'] = relationship('Group', back_populates='groupmembership')
    user: Mapped['User'] = relationship('User', back_populates='groupmembership')


class Media(Base):
    __tablename__ = 'media'
    __table_args__ = (
        ForeignKeyConstraint(['post_id'], ['post.post_id'], name='media_ibfk_2'),
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='media_ibfk_1'),
        Index('post_id', 'post_id'),
        Index('user_id', 'user_id')
    )

    media_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    post_id: Mapped[Optional[int]] = mapped_column(Integer)
    type: Mapped[Optional[str]] = mapped_column(String(50))
    content: Mapped[Optional[str]] = mapped_column(Text)
    uploaded_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    post: Mapped['Post'] = relationship('Post', back_populates='media')
    user: Mapped['User'] = relationship('User', back_populates='media')


class Tag(Base):
    __tablename__ = 'tag'
    __table_args__ = (
        ForeignKeyConstraint(['post_id'], ['post.post_id'], name='tag_ibfk_2'),
        ForeignKeyConstraint(['tagged_user_id'], ['user.user_id'], name='tag_ibfk_1'),
        Index('post_id', 'post_id'),
        Index('tagged_user_id', 'tagged_user_id')
    )

    tag_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tagged_user_id: Mapped[Optional[int]] = mapped_column(Integer)
    post_id: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    post: Mapped['Post'] = relationship('Post', back_populates='tag')
    tagged_user: Mapped['User'] = relationship('User', back_populates='tag')


class Like(Base):
    __tablename__ = 'like'
    __table_args__ = (
        ForeignKeyConstraint(['comment_id'], ['comment.comment_id'], name='like_ibfk_2'),
        ForeignKeyConstraint(['post_id'], ['post.post_id'], name='like_ibfk_3'),
        ForeignKeyConstraint(['user_id'], ['user.user_id'], name='like_ibfk_1'),
        Index('comment_id', 'comment_id'),
        Index('post_id', 'post_id'),
        Index('user_id', 'user_id')
    )

    like_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer)
    comment_id: Mapped[Optional[int]] = mapped_column(Integer)
    post_id: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    comment: Mapped['Comment'] = relationship('Comment', back_populates='like')
    post: Mapped['Post'] = relationship('Post', back_populates='like')
    user: Mapped['User'] = relationship('User', back_populates='like')
