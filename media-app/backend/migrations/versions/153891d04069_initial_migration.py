"""initial migration

Revision ID: 153891d04069
Revises: 
Create Date: 2024-11-21 20:24:11.770496

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '153891d04069'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('comment')
    op.drop_table('group')
    op.drop_table('event')
    op.drop_table('groupmembership')
    op.drop_table('notification')
    op.drop_table('chatbox')
    op.drop_table('like')
    op.drop_table('tag')
    op.drop_table('media')
    op.drop_table('message')
    with op.batch_alter_table('friendship', schema=None) as batch_op:
        batch_op.alter_column('user_id_1',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('user_id_2',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('content',
               existing_type=mysql.TEXT(),
               nullable=False)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('username',
               existing_type=mysql.VARCHAR(length=30),
               nullable=False)
        batch_op.alter_column('email',
               existing_type=mysql.VARCHAR(length=100),
               nullable=False)
        batch_op.alter_column('password',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
        batch_op.create_unique_constraint(None, ['username'])
        batch_op.create_unique_constraint(None, ['email'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('password',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('email',
               existing_type=mysql.VARCHAR(length=100),
               nullable=True)
        batch_op.alter_column('username',
               existing_type=mysql.VARCHAR(length=30),
               nullable=True)

    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('content',
               existing_type=mysql.TEXT(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('friendship', schema=None) as batch_op:
        batch_op.alter_column('user_id_2',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id_1',
               existing_type=mysql.INTEGER(),
               nullable=True)

    op.create_table('message',
    sa.Column('message_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('sender_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('receiver_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('content', mysql.VARCHAR(length=1000), nullable=True),
    sa.Column('is_read', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('chatbox_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('time', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['chatbox_id'], ['chatbox.chatbox_id'], name='fk_chatbox_id'),
    sa.ForeignKeyConstraint(['receiver_id'], ['user.user_id'], name='message_ibfk_2'),
    sa.ForeignKeyConstraint(['sender_id'], ['user.user_id'], name='message_ibfk_1'),
    sa.PrimaryKeyConstraint('message_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('media',
    sa.Column('media_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('post_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('type', mysql.VARCHAR(length=50), nullable=True),
    sa.Column('content', mysql.TEXT(), nullable=True),
    sa.Column('uploaded_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.post_id'], name='media_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='media_ibfk_1'),
    sa.PrimaryKeyConstraint('media_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('tag',
    sa.Column('tag_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('tagged_user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('post_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.post_id'], name='tag_ibfk_2'),
    sa.ForeignKeyConstraint(['tagged_user_id'], ['user.user_id'], name='tag_ibfk_1'),
    sa.PrimaryKeyConstraint('tag_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('like',
    sa.Column('like_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('comment_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('post_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['comment_id'], ['comment.comment_id'], name='like_ibfk_2'),
    sa.ForeignKeyConstraint(['post_id'], ['post.post_id'], name='like_ibfk_3'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='like_ibfk_1'),
    sa.PrimaryKeyConstraint('like_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('chatbox',
    sa.Column('chatbox_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id_1', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id_2', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('content', mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_0900_ai_ci', length=100), nullable=True),
    sa.Column('is_read', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id_1'], ['user.user_id'], name='fk_user1'),
    sa.ForeignKeyConstraint(['user_id_2'], ['user.user_id'], name='fk_user2'),
    sa.PrimaryKeyConstraint('chatbox_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('notification',
    sa.Column('notification_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('type', mysql.VARCHAR(length=50), nullable=True),
    sa.Column('content', mysql.TEXT(), nullable=True),
    sa.Column('is_read', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='notification_ibfk_1'),
    sa.PrimaryKeyConstraint('notification_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('groupmembership',
    sa.Column('group_membership_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('group_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('role', mysql.VARCHAR(length=50), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['group.group_id'], name='groupmembership_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='groupmembership_ibfk_1'),
    sa.PrimaryKeyConstraint('group_membership_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('event',
    sa.Column('event_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('group_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('name', mysql.VARCHAR(length=100), nullable=True),
    sa.Column('description', mysql.TEXT(), nullable=True),
    sa.Column('start_time', mysql.DATETIME(), nullable=True),
    sa.Column('end_time', mysql.DATETIME(), nullable=True),
    sa.Column('location', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.Column('updated_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['group.group_id'], name='event_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='event_ibfk_1'),
    sa.PrimaryKeyConstraint('event_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('group',
    sa.Column('group_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('name', mysql.VARCHAR(length=100), nullable=True),
    sa.Column('description', mysql.TEXT(), nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.Column('visibility', mysql.VARCHAR(length=20), nullable=True),
    sa.Column('members', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('cover_photo', mysql.VARCHAR(length=255), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='group_ibfk_1'),
    sa.PrimaryKeyConstraint('group_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('comment',
    sa.Column('comment_id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('post_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('content', mysql.TEXT(), nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.Column('updated_at', mysql.DATETIME(), nullable=True),
    sa.Column('parent_comment_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('is_edited', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.post_id'], name='comment_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], name='comment_ibfk_1'),
    sa.PrimaryKeyConstraint('comment_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
