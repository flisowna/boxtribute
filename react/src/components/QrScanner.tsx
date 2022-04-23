import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Textarea } from "@chakra-ui/react";
import { Button, Container } from "@chakra-ui/react";


const extractQrCodeFromUrl = (url) => {
  const rx = /.*barcode=(.*)/g;
  const arr = rx.exec(url);
  return arr?.[1]; 
}

const QrScanner = (props) => {
  const [data, setData] = useState("No result");
  const [qrOpen, setQrOpen] = useState(true);

  return (
    <>
      <Button
        onClick={() => setQrOpen(!qrOpen)}
        colorScheme="teal"
        variant="outline"
      >
        Scan QR Code
      </Button>
      {qrOpen ? (
        <Container isOpen={qrOpen} maxW='md'>
          <QrReader
            constraints={{
              facingMode: "user",
            }}
            scanDelay={1000}
            onResult={(result, error) => {
              if (!!result) {
                console.log(result);
                const qrCode = extractQrCodeFromUrl(result["text"])
                if(qrCode != null) {
                  setData(qrCode);
                }
              }

              if (!!error) {
                console.info(error);
              }
            }}
          />
        </Container>
      ) : null}
      <Textarea
        style={{ fontSize: 18, width: 320, height: 100, marginTop: 100 }}
        value={data}
      />
    </>
  );
};

export default QrScanner;