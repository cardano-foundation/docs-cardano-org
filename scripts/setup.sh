#!/bin/bash

# Generate SSH key for deployments
printf "\nRunning setup ...\n\n"
mkdir -p ~/.ssh
printf "Generating SSH keys for deployments\n"
KEY_NAME="circle_ciwriteable_$(date +%s)"
ssh-keygen -f ~/.ssh/$KEY_NAME -C "CircleCI writeable" -m PEM -t rsa -q -N "" > /dev/null
KEY_FINGERPRINT=$(ssh-keygen -E md5 -lf ~/.ssh/$KEY_NAME | sed "s/.*MD5:\([a-fA-F0-9:]*\).*/\1/")
PUBLIC_KEY=$(cat ~/.ssh/$KEY_NAME.pub | tr -d "\n")
PRIVATE_KEY=$(cat ~/.ssh/$KEY_NAME)
rm ~/.ssh/$KEY_NAME ~/.ssh/$KEY_NAME.pub
GIT_USERNAME="circleci"
GIT_EMAIL="circleci@iohk.io"

GITHUB_USERNAME=""
GITHUB_TOKEN=""
printf "\nEnter the GitHub username of the account you would like to use\n"
while [[ $GITHUB_USERNAME == "" ]]; do
    read -p ": " GITHUB_USERNAME
done

printf "\nPlease now generate a personal access token with full repository access for '%s':\n" $GITHUB_USERNAME
printf "https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line\n"
printf "\nOpening https://github.com/settings/tokens/new\n\n"

read -p "Press enter to continue ..." any_key
open "https://github.com/settings/tokens/new"

printf "\nOnce you are done enter the token value here\n"
while [[ $GITHUB_TOKEN == "" ]]; do
    read -p ": " GITHUB_TOKEN
done

# Getting CNAME
printf "\nWhat domain would you like to use for the production site? (This value will be used in static/CNAME)\n"
PRODUCTION_DOMAIN=""
while [[ $PRODUCTION_DOMAIN == "" ]]; do
    read -p ": " PRODUCTION_DOMAIN
done

# Setting CNAME
echo $PRODUCTION_DOMAIN > ./static/CNAME

# Prompt for GitHub Repo creation
printf "\nTime to create your remote repository on GitHub, come back here when you have created it. Don't add any files to the repo."
printf "\nopening https://github.com/new\n\n"
read -p "Press enter to continue ..." any_key
open "https://github.com/new"

REPO_NAME_CORRECT="false"
while [[ $REPO_NAME_CORRECT == "false" ]]; do
    printf "\nEnter the owner of the repository\n"
    REPO_ORGANISATION=""
    while [[ $REPO_ORGANISATION == "" ]]; do
        read -p ": " REPO_ORGANISATION
    done

    printf "\nEnter the repository name\n"
    REPO_PROJECT=""
    while [[ $REPO_PROJECT == "" ]]; do
        read -p ": " REPO_PROJECT
    done

    printf "\nYour new repository is located at 'https://github.com/%s/%s'\n" $REPO_ORGANISATION $REPO_PROJECT
    printf "Is this correct? (y/N)\n"
    read -p ": " IS_CORRECT
    if [[ $IS_CORRECT == "y" ]]; then
        REPO_NAME_CORRECT="true"
    else
        REPO_ORGANISATION=""
        REPO_PROJECT=""
    fi
done

# Prompt for linking repo in CircleCI
printf "\nCreate the project in CircleCI"
printf "\nOpening https://circleci.com/add-projects/gh/$REPO_ORGANISATION\n"
read -p "Press enter to continue ..." any_key
open "https://circleci.com/add-projects/gh/$REPO_ORGANISATION"

printf "\nHave you created the CircleCI project? (y/N)"
CREATED_CIRCLE_CI_PROJECT="false"
while [[ $CREATED_CIRCLE_CI_PROJECT == "false" ]]; do
    read -p ": " created
    if [[ $created == "y" ]]; then
        CREATED_CIRCLE_CI_PROJECT="true"
    fi
done

# Prompt for adding private deployment key to CircleCI
printf "\nAdd deployment keys to CircleCI\n"
printf "\nSet the host to 'github.com'\n\n"
echo "$PRIVATE_KEY"
printf "\n\nOpening https://circleci.com/gh/$REPO_ORGANISATION/$REPO_PROJECT/edit#ssh\n"
read -p "Press enter to continue ..." any_key
open "https://circleci.com/gh/$REPO_ORGANISATION/$REPO_PROJECT/edit#ssh"

printf "\nHave you copied the private key above into CircleCI? (y/N)\n"
PRIVATE_KEY_COPIED="false"
while [[ $PRIVATE_KEY_COPIED == "false" ]]; do
    read -p ": " copied
    if [[ $copied == "y" ]]; then
        PRIVATE_KEY_COPIED="true"
    fi
done

# Prompt for adding environment variables to CircleCI
printf "\nSet up CircleCI environment variables. Copy the following:\n"
printf "\n* GIT_EMAIL = %s" $GIT_EMAIL
printf "\n* GIT_USERNAME = %s" $GIT_USERNAME
printf "\n* GITHUB_USERNAME = %s" $GITHUB_USERNAME
printf "\n* GITHUB_TOKEN = %s" $GITHUB_TOKEN

printf "\n"

printf "\nOpening https://circleci.com/gh/$REPO_ORGANISATION/$REPO_PROJECT/edit#env-vars\n"
read -p "Press enter to continue ..." any_key
open "https://circleci.com/gh/$REPO_ORGANISATION/$REPO_PROJECT/edit#env-vars"

printf "\nHave you copied the environment variables above into CircleCI? (y/N)\n"
ENV_VARS_COPIED="false"
while [[ $ENV_VARS_COPIED == "false" ]]; do
    read -p ": " copied
    if [[ $copied == "y" ]]; then
        ENV_VARS_COPIED="true"
    fi
done

# Adding fingerprint to Circle CI config
sed "s/<<DEPLOYMENT_SSH_KEY_FINGERPRINT>>/$KEY_FINGERPRINT/g" ./.circleci/sample_config.yml > ./.circleci/config.yml
rm ./.circleci/sample_config.yml

# Remove self script at this point so it does not appear in git history
rm ./scripts/setup.sh

# Remove any references to git and initialise new repo
rm -rf ./.git
git init

# Setting up git and local files
printf "\n\nSetting up git origin\n"
git remote remove origin
git remote add origin "git@github.com:$REPO_ORGANISATION/$REPO_PROJECT.git"

# Adding deployment key to GitHub
curl -u $GITHUB_USERNAME:$GITHUB_TOKEN -d "{\"title\":\"Circle CI writeable key\",\"key\":\"$PUBLIC_KEY\",\"read_only\":false}" -H "Content-Type: application/json" -X POST https://api.github.com/repos/$REPO_ORGANISATION/$REPO_PROJECT/keys

# Pushing code to trigger build
printf "\nPushing code to remote repository\n"
git add --all
git commit -m "Setup site"
git push -u origin master
git checkout -b staging
git push origin staging

# Updating GitHub repo settings via API
printf "\nSetting the default branch to staging\n"
curl -u $GITHUB_USERNAME:$GITHUB_TOKEN -d '{"default_branch":"staging"}' -H "Content-Type: application/json" -X PATCH https://api.github.com/repos/$REPO_ORGANISATION/$REPO_PROJECT

# Link netlify instructions
printf "\nLink project to netlify\n"
printf "\n* Set branch to deploy as 'staging'"
printf "\n* Set build command to 'npm run build'"
printf "\n* Set publish directory to 'public/'"
printf "\n\nOpening https://app.netlify.com/\n"
read -p "Press enter to continue ..." any_key
open "https://app.netlify.com/"

printf "\nHave you linked the project with Netlify? (y/N)\n"
NETLIFY_LINKED="false"
while [[ $NETLIFY_LINKED == "false" ]]; do
    read -p ": " copied
    if [[ $copied == "y" ]]; then
        NETLIFY_LINKED="true"
    fi
done

printf "\nOnce Netlify site has been setup, go to the sites settings in Netlify\n"
printf "\n* Navigate to 'identity'"
printf "\n* Enable identity"
printf "\n* Enable Git Gateway (if this fails then you may need to manually generate the access token https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)"

printf "\n\nHave you updated the Netlify site settings? (y/N)\n"
NETLIFY_SETTINGS_UPDATED="false"
while [[ $NETLIFY_SETTINGS_UPDATED == "false" ]]; do
    read -p ": " copied
    if [[ $copied == "y" ]]; then
        NETLIFY_SETTINGS_UPDATED="true"
    fi
done

printf "\n\nThat concludes the setup process.\nSome additional optional steps:\n"
printf "\n* Configure access on GitHub repo"
printf "\n* Configure branch protection on GitHub repo"
printf "\n* Setup identity and security on Netlify"
printf "\n* Setup Google Analytics and insert tracking ID into 'src/config/index.js'"
printf "\n* Setup a new project in Uploadcare for static assets\n\n"

read -p "Press enter to complete setup ..." any_key
