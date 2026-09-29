import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def ask_llama(instructions: str, user_input: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": instructions
            },
            {
                "role": "user",
                "content": user_input
            }
        ],
        temperature=0.2,
        max_tokens=2000
    )

    return response.choices[0].message.content


def review_code(code: str, language: str) -> str:

    instructions = """
You are an expert software engineer and code reviewer.

Review the code provided by the user.

Give the response in the following structure:

1. Code Quality
2. Potential Issues
3. Suggestions for Improvement
4. Refactored Code
5. Additional Suggestions

Be clear and beginner-friendly.
Focus on correctness, readability, maintainability, performance, and best practices.
"""

    user_input = f"""
Programming Language: {language}

Code:
{code}
"""

    return ask_llama(instructions, user_input)


def explain_bug(code: str, language: str) -> str:

    instructions = """
You are an expert software engineer.

Explain the bug or potential problems in the code provided by the user.

Give the response in the following structure:

1. Problem
2. Why it happens
3. How to fix it
4. Corrected Code
5. Additional Suggestions

Be clear and beginner-friendly.

If there is no obvious bug, explain potential issues or improvements.
"""

    user_input = f"""
Programming Language: {language}

Code:
{code}
"""

    return ask_llama(instructions, user_input)


def generate_sql(requirement: str) -> str:

    instructions = """
You are an expert SQL developer and database engineer.

Convert the user's natural-language requirement into a correct SQL query.

Provide the response in the following structure:

1. SQL Query
2. Explanation
3. Assumptions

Use standard SQL unless the user specifies a particular database such as
MySQL, PostgreSQL, SQLite, or SQL Server.

Do not invent unnecessary tables or columns.
If the database structure is unclear, clearly state your assumptions.
"""

    user_input = f"""
User Requirement:
{requirement}
"""

    return ask_llama(instructions, user_input)


def generate_regex(requirement: str) -> str:

    instructions = """
You are an expert in regular expressions and software development.

Convert the user's natural-language requirement into a correct regular expression.

Provide the response in the following structure:

1. Regular Expression
2. Explanation
3. Example Matches
4. Example Non-Matches
5. Notes

Make the regex clear and practical.
Mention if the regex syntax depends on a particular programming language.
"""

    user_input = f"""
User Requirement:
{requirement}
"""

    return ask_llama(instructions, user_input)


def generate_docs(code: str, language: str) -> str:

    instructions = """
You are an expert software engineer and technical documentation writer.

Generate clear API documentation for the provided code.

Give the response in the following structure:

1. Overview
2. Endpoints
3. HTTP Methods
4. Parameters
5. Request Body
6. Response
7. Example Usage
8. Notes

If some information cannot be determined from the code, clearly state the assumption.
Do not invent unnecessary details.
"""

    user_input = f"""
Programming Language: {language}

Code:
{code}
"""

    return ask_llama(instructions, user_input)


def generate_commit_message(changes: str) -> str:

    instructions = """
You are an expert software developer who follows Git best practices.

Generate a clear and meaningful Git commit message based on the
changes provided by the user.

Use a conventional commit format when appropriate, such as:

feat:
fix:
docs:
refactor:
test:
chore:

Give the response in the following structure:

1. Commit Message
2. Explanation

Keep the commit message concise and descriptive.
"""

    user_input = f"""
Changes Made:
{changes}
"""

    return ask_llama(instructions, user_input)


def generate_unit_tests(code: str, language: str) -> str:

    instructions = """
You are an expert software engineer and testing specialist.

Generate useful unit tests for the provided code.

Give the response in the following structure:

1. Testing Approach
2. Unit Tests
3. Edge Cases
4. Expected Results
5. Notes

Use the appropriate testing framework for the programming language.
For example:
- Python → pytest
- Java → JUnit
- JavaScript → Jest

Cover normal cases, edge cases, and invalid inputs where applicable.
Do not invent behavior that is not present in the code.
"""

    user_input = f"""
Programming Language: {language}

Code:
{code}
"""

    return ask_llama(instructions, user_input)


def generate_dockerfile(project_description: str) -> str:

    instructions = """
You are an expert DevOps and software engineer.

Generate a correct, practical Dockerfile based strictly on the user's project description.

Give the response in the following structure:

1. Dockerfile
2. Explanation
3. Base Image
4. Dependencies
5. Port
6. Build and Run Instructions
7. Notes

CRITICAL Dockerfile requirements:
- Use ONLY information explicitly provided in the user's project description.
- Do NOT invent filenames, module names, package names, entry points, commands, or dependencies.
- For FastAPI, NEVER assume "main.py", "main:app", or any other module path unless the user explicitly provides the entry point.
- If the FastAPI entry point is not provided, use a clearly marked placeholder such as "your_module:app" and explicitly explain that the user must replace it.
- If an entry point is unknown, do not claim that the generated Dockerfile is directly runnable.
- Use the language, framework, application type, port, and dependencies specified by the user.
- Do not add dependencies that were not specified unless they are required by the framework itself.
- Do not add a HEALTHCHECK unless the required tool is explicitly available.
- Avoid unnecessary multi-stage builds.
- Keep the Dockerfile simple and practical.
- Ensure the Dockerfile is syntactically valid.
- Keep the Dockerfile separate from the explanation using a fenced code block.
- Keep build and run commands separate from the Dockerfile code block.

The most important rule is: NEVER invent an application entry point.
"""

    user_input = f"""
Project Description:
{project_description}
"""

    return ask_llama(instructions, user_input)
