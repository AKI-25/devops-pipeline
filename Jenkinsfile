pipeline {
  environment {
    dockerimagename = "abdelkefiismail/book-saw"
    dockerimagetag = "v1"
    dockerImage = ""
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
                    ls
                }

            }
            stage('Build the result microservice'){

            }
            stage('Build the worker microservice'){

            }
        }
    }
    // stage('Pushing Image') {
    //   environment {
    //            registryCredential = 'DockerhubCredentials'
    //        }
    //   steps{
    //     script {
    //       docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
    //         dockerImage.push dockerimagetag
    //       }
    //     }
    //   }
    // }
    // stage('Run Ansible Playbook') {
    //   steps {
    //     script {      
    //       // run the ansible playbook 
    //       sh 'ansible-playbook AnsiblePlaybooks/kubernetes-environment-playbook.yaml'
    //     }
    //   }
    // }

    // stage('Deploying Booksaw Application to Kubernetes') {
    //   steps {
    //     script {
    //       sh 'kubectl set image deployment/booksaw-deployment booksaw-web-server=${dockerimagename}:${dockerimagetag}'
    //     }
    //   }
    // }
  }
}