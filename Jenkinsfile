pipeline {
  environment {
    dockerimagename = "abdelkefiismail/book-saw"
    dockerimagetag = "v1"
    dockerImage = ""
    NODEJS_HOME = tool 'NodeJS'
    GO_HOME = tool 'GO'
  }
  agent any
  stages {
    stage('Checkout Source') {
      steps {
        git 'https://github.com/AKI-25/devops-pipeline.git'
      }
    }
    stage('Build code') {
        parallel {
            stage('Build the voting microservice'){
                steps{
                    script {
                        dir('code/voting-ui') {
                            sh '${NODEJS_HOME}/bin/npm install'
                            sh '${NODEJS_HOME}/bin/npm run build'
                        }
                    }
                }

            }
            stage('Build the result microservice'){
                steps{
                    script {
                        dir('code/result-ui') {
                            sh '${NODEJS_HOME}/bin/npm install'
                            sh '${NODEJS_HOME}/bin/npm run build'
                        }
                    }
                }
            }
            stage('Build the worker microservice'){
                steps{
                    script {
                        dir('code/worker') {
                            sh '${GO_HOME}/bin/go build -o worker ./cmd/worker/'
                        }
                    }
                }
            }
        }
    }
    stage('Test code') {
        parallel {
            stage('Testing the voting microservice'){
                steps{
                    script {
                        dir('code/voting-ui') {

                        }
                    }
                }

            }
            stage('Testing the result microservice'){
                steps{
                    script {
                        dir('code/result-ui') {
                            
                        }
                    }
                }
            }
            stage('Testing the worker microservice'){
                steps{
                    script {
                        dir('code/worker') {
                            
                        }
                    }
                }
            }
        }
    }
    stage('Build Images') {
        parallel {
            stage('Build the voting image'){
                steps{
                    script {
                        dir('code/voting-ui') {
                            dockerVotingImage = docker.build("voting-ui:latest")
                        }
                    }
                }

            }
            stage('Building the result image'){
                steps{
                    script {
                        dir('code/result-ui') {
                            dockerResultImage = docker.build("result-ui:latest")
                        }
                    }
                }
            }
            stage('Building the worker image'){
                steps{
                    script {
                        dir('code/worker') {
                            dockerWorkerImage = docker.build("vote-worker:latest")
                        }
                    }
                }
            }
            stage('Building the vote database image'){
                steps{
                    script {
                        dir('code/result-db') {
                            dockerResultDBImage = docker.build("result-db:latest")
                        }
                    }
                }
            }
            stage('Building the result database image'){
                steps{
                    script {
                        dir('code/voting-db') {
                            dockerVotingDBImage = docker.build("voting-db:latest")
                        }
                    }
                }
            }
        }
    }
    stage('Push Images') {
        environment {
               registryCredential = 'DockerhubCredentials'
        }
        parallel {
            stage('Push the voting image'){
                steps{
                    script {
                        dir('code/voting-ui') {
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerVotingImage.push('latest')
                            }
                        }
                    }
                }

            }
            stage('Building the result image'){
                steps{
                    script {
                        dir('code/result-ui') {
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerResultImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Building the worker image'){
                steps{
                    script {
                        dir('code/worker') {
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerWorkerImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Building the vote database image'){
                steps{
                    script {
                        dir('code/result-db') {
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerVotingDBImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Building the result database image'){
                steps{
                    script {
                        dir('code/voting-db') {
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerResultDBImage.push('latest')
                            }
                        }
                    }
                }
            }
        }
    }
  }
}