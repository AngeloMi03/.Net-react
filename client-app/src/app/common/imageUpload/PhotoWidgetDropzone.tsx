import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props {
  setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
  const dzStyles = {
    border: "dashed 3px #eee",
    borderColoer: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as 'center',
    height: 200,
  };

  const dzActive = {
    borderColoer: "green",
  };

  const onDrop = useCallback((acceptedfile: any) => {
    console.log("acceted file "+ JSON.stringify(acceptedfile) )
 
    setFiles(
      acceptedfile.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzStyles,...dzActive}: dzStyles}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content='drop zone image here' />
    </div>
  );
}
