import json

# Read current questions
with open('data/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# New questions from quiz3.html (starting from ID 69)
new_questions = [
    {
        "id": 69,
        "type": "multiple",
        "question": "A company is testing its incident response plan for compromised credentials. The company runs a database on an Amazon EC2 instance and stores the sensitive database credentials as a secret in AWS Secrets Manager. The secret has rotation configured with an AWS Lambda function that uses the generic rotation function template. The EC2 instance and the Lambda function are deployed in the same private subnet. The VPC has a Secrets Manager VPC endpoint. A security engineer discovers that the secret cannot rotate. The security engineer determines that the VPC endpoint is working as intended. The Amazon CloudWatch logs contain the following error: \"setSecret: Unable to log into database\". Which solution will resolve this error?",
        "options": [
            "Ensure that the Lambda function has network access to the database instance.",
            "Add the SecretsManagerReadWrite policy to the Lambda execution role.",
            "Add the Lambda function to the database security group.",
            "Enable rotation on the database instead of Secrets Manager."
        ],
        "correct": [0, 2],
        "explanation": "✅ Correct: A - Lambda must be able to connect to the DB to perform rotation; C - Ensure the Lambda's networking/security-group settings allow DB access. ❌ Incorrect: B - IAM isn't the root cause when the function cannot connect over the network; D - Rotation must be coordinated via Secrets Manager / Lambda.",
        "keywords": ["incident response", "Secrets Manager", "rotation", "Lambda", "database"]
    },
    {
        "id": 70,
        "type": "multiple",
        "question": "A company needs a forensic-logging solution for hundreds of applications running in Docker on Amazon EC2. The solution must perform real-time analytics on the logs, must support the replay of messages, and must persist the logs. Which AWS services should be used to meet these requirements? (Select TWO)",
        "options": [
            "Amazon CloudWatch Logs",
            "Amazon Kinesis Data Streams",
            "Amazon SQS",
            "Amazon S3"
        ],
        "correct": [1, 3],
        "explanation": "✅ Correct: B - Kinesis provides real-time processing and replay capabilities; D - S3 provides durable persistent storage for forensic evidence. ❌ Incorrect: A - CloudWatch is useful for monitoring but not ideal for replay scenarios; C - SQS is not designed for large-scale log replay and persistence.",
        "keywords": ["forensic", "logging", "Docker", "EC2", "analytics", "replay", "persist"]
    },
    {
        "id": 71,
        "type": "single",
        "question": "A company is evaluating the use of AWS Systems Manager Session Manager to gain access to the company's Amazon EC2 instances. However, until the company implements the change, the company must protect the key file for the EC2 instances from read and write operations by any other users. When a security administrator tries to connect to a critical EC2 Linux instance during an emergency, the security administrator receives the following error: \"Error Unprotected private key file – Permissions for 'ssh/my_private_key.pem' are too open\". Which command should the security administrator use to modify the private key file permissions to resolve this error?",
        "options": [
            "chmod 400 ssh/my_private_key.pem",
            "chmod 600 ssh/my_private_key.pem",
            "chmod 700 ssh/my_private_key.pem",
            "chmod 744 ssh/my_private_key.pem"
        ],
        "correct": [0],
        "explanation": "✅ Correct: A - chmod 400 restricts the file to be readable only by the owner, which SSH requires for private keys. ❌ Incorrect: B - chmod 600 is sometimes acceptable, but 400 is the stricter recommended mode for private keys; C - chmod 700 grants execute permission, not appropriate; D - chmod 744 leaves world-readable bits set and is not secure for private keys.",
        "keywords": ["Session Manager", "EC2", "Linux", "private key", "permissions"]
    }
]

# Add new questions to existing data
data["questions"].extend(new_questions)

# Write back to file
with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_questions)} questions. Total questions: {len(data['questions'])}")