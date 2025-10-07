import {Button} from "@chakra-ui/react";
import {Table} from "antd";


const MyComponent = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    // ... more columns
  ];

  const data = [
    { key: '1', name: 'John Doe', age: 30 },
    { key: '2', name: 'Jane Doe', age: 25 },
    // ... more data
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={data} />
      </div>
      <Button variant="ghost" className="text-red-500 hover:text-red-600 text-sm">
        Remove
      </Button>
    </div>
  );
};

export default MyComponent;

