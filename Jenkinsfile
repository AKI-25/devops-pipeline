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
    stage('Installing Dependencies') {
        steps {
            dir('AnsiblePlaybooks') {
                ansiblePlaybook(
                    colorized: true,
                    playbook: 'dependency-configurator.yaml',
                )
            }
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
    stage('Scanning Docker Images') {
            steps {
                script {
                    sh '''
                        touch trivy_votingui_scan_results && trivy image abdelkefiismail/voting-ui:latest --format json --output ./trivy_votingui_scan_results
                        touch trivy_resultui_scan_results && trivy image abdelkefiismail/result-ui:latest --format json --output ./trivy_resultui_scan_results
                        touch trivy_votingdb_scan_results && trivy image abdelkefiismail/voting-db:latest --format json --output ./trivy_votingdb_scan_results
                        touch trivy_resutdb_scan_results && trivy image abdelkefiismail/result-db:latest --format json --output ./trivy_resultdb_scan_results
                        touch trivy_worker_scan_results && trivy image abdelkefiismail/vote-worker:latest --format json --output ./trivy_worker_scan_results 
                    '''
                }
            }
        }        
    stage('Build Images') {
        parallel {
            stage('Build the voting image'){
                steps{
                    script {
                        dir('code/voting-ui') {
                            dockerVotingImage = docker.build("abdelkefiismail/voting-ui:latest")
                        }
                    }
                }

            }
            stage('Building the result image'){
                steps{
                    script {
                        dir('code/result-ui') {
                            dockerResultImage = docker.build("abdelkefiismail/result-ui:latest")
                        }
                    }
                }
            }
            stage('Building the worker image'){
                steps{
                    script {
                        dir('code/worker') {
                            dockerWorkerImage = docker.build("abdelkefiismail/vote-worker:latest")
                        }
                    }
                }
            }
            stage('Building the vote database image'){
                steps{
                    script {
                        dir('code/result-db') {
                            dockerResultDBImage = docker.build("abdelkefiismail/result-db:latest")
                        }
                    }
                }
            }
            stage('Building the result database image'){
                steps{
                    script {
                        dir('code/voting-db') {
                            dockerVotingDBImage = docker.build("abdelkefiismail/voting-db:latest")
                        }
                    }
                }
            }
        }
    }
    stage('Docker Bench Scan Docker environment') {
            steps {
                script {
                         sh '''
                             
                            rm -rf docker-bench-security
                            git clone https://github.com/docker/docker-bench-security.git
                            cd docker-bench-security/
                            chmod +x docker-bench-security.sh  
                            touch docker_bench_security_scan_results
                            ./docker-bench-security.sh > docker_bench_security_scan_results
                            cat docker_bench_security_scan_results  
         
                         '''                        
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
                            docker.withRegistry( '', registryCredential ) {
                                dockerVotingImage.push('latest')
                            }
                        }
                    }
                }

            }
            stage('Push the result image'){
                steps{
                    script {
                        dir('code/result-ui') {
                            docker.withRegistry( '', registryCredential ) {
                                dockerResultImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Push the worker image'){
                steps{
                    script {
                        dir('code/worker') {
                            docker.withRegistry( '', registryCredential ) {
                                dockerWorkerImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Push the vote database image'){
                steps{
                    script {
                        dir('code/result-db') {
                            docker.withRegistry( '', registryCredential ) {
                                dockerVotingDBImage.push('latest')
                            }
                        }
                    }
                }
            }
            stage('Push the result database image'){
                steps{
                    script {
                        dir('code/voting-db') {
                            docker.withRegistry( '', registryCredential ) {
                                dockerResultDBImage.push('latest')
                            }
                        }
                    }
                }
            }
        }
    }
    stage('Deploying Application') {
        steps{
            script {
                dir('KubernetesManifests') {
                    sh 'kubectl replace -f ./*'
                }
            }
        }
    }
    stage('Deploying Monitoring Solution') {
        steps {
            script {
                sh 'helm install prometheus prometheus-community/kube-prometheus-stack'
            } 
        }
    }
  }
}