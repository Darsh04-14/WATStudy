import csv


def generate_insert_statements(file_path, table_name):
    insert_statements = []
    with open(file_path, 'r', newline='') as file:
        reader = csv.reader(file)
        headers = next(reader)  # First line contains headers
        for row in reader:
            values = ["{}".format(value) for value in row]
            for i in range(0, len(values)):
                values[i] = values[i].strip()
                if values[i].isdigit() == False and values[i][0] != '\"':
                    values[i] = f"\"{values[i]}\""
                    
            insert_statement = f"INSERT INTO watstudy.{table_name} ({', '.join(headers)}) VALUES ({', '.join(values)});"
            insert_statements.append(insert_statement)
    return insert_statements


# Usage example
table_names = ["user_table", "courses", "session_table", "enrolled", "friends", "participants", "session_review"]
output_file_path = 'populatetables.sql'  # Path to output SQL file

with open(output_file_path, 'w') as file:
    for table_name in table_names:
        print(table_name)
        file_path = f'{table_name}.txt'  # Path to your CSV formatted .txt file

        statements = generate_insert_statements(file_path, table_name)
        for statement in statements:
            file.write(statement + '\n')
