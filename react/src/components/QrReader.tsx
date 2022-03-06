import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Textarea } from "@chakra-ui/react";
import { Button, Container } from '@chakra-ui/react'

const Qrreader = (props) => {
  const [data, setData] = useState("No result");
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <>
        <Button onClick={()=>setQrOpen(!qrOpen)} colorScheme='teal' variant='outline'>
    Scan QR Code
  </Button>
    {
      qrOpen ? 
      <Container isOpen={qrOpen} maxW='container.md'>
      <QrReader
        constraints={{
          facingMode: "user",
        }}
        scanDelay={1000}
        onResult={(result, error) => {
          if (!!result) {
            setData(result['text']);
            console.log(result['text'])
          }

          if (!!error) {
            console.info(error);
          }
        }}
      />
      </Container> : null}
      <Textarea style={{ fontSize: 18, width: 320, height: 100, marginTop: 100 }} value={data} />
    </>
  );
};

export default Qrreader;
