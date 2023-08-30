import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from models.authors import AuthorPasswordOut, AuthorOut
from queries.authors import AuthorQueries


class AuthorAuthenticator(Authenticator):
    async def get_account_data(
        self,
        username: str,
        accounts: AuthorQueries,
    ):
        # Use your repo to get the account based on the
        # username (which could be an email)
        return accounts.get_author_by_username(username)

    def get_account_getter(
        self,
        accounts: AuthorQueries = Depends(),
    ):
        # Return the accounts. That's it.
        return accounts

    def get_hashed_password(self, account: AuthorPasswordOut):
        # Return the encrypted password value from your
        # account object
        return account.password

    def get_account_data_for_cookie(self, account: AuthorOut):
        # Return the username and the data for the cookie.
        # You must return TWO values from this method.
        return account.username, AuthorOut(**account.dict())


authenticator = AuthorAuthenticator(os.environ["SIGNING_KEY"])
