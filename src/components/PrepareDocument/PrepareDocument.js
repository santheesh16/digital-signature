import React, { useRef, useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import WebViewer from "@pdftron/webviewer";
import "gestalt/dist/gestalt.css";
import "./PrepareDocument.css";

const PrepareDocument = () => {
  const [instance, setInstance] = useState(null);
  const [dropPoint, setDropPoint] = useState(null);
  const [annotManager, setAnnotatManager] = useState(null);

  const viewer = useRef(null);
  const filePicker = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "webviewer",
        disabledElements: [
          "textSelectButton",
          "viewControlsButton",
          "selectToolButton",
          "redoButton",
          "panToolButton",
          "leftPanelButton",
          "ribbons",
          "toggleNotesButton",
          "searchButton",
          "menuButton",
          "searchButton",
          "menuButton",
          "rubberStampToolGroupButton",
          "stampToolGroupButton",
          "fileAttachmentToolGroupButton",
          "calloutToolGroupButton",
          "eraserToolButton",
          "undoButton",
          "textSignaturePanelButton",
          "imageSignaturePanelButton",
          "inkSignaturePanelButton",
          "colorPalette",
          "zoomOutButton",
          "zoomInButton",
          "zoomOverlayButton",
          "moreButton",
          "header",
        ],
      },

      viewer.current
    ).then((instance) => {
      const { iframeWindow } = instance;

      // select only the view group
      instance.setToolbarGroup("toolbarGroup-View");
      setInstance(instance);

      const iframeDoc = iframeWindow.document.body;
      iframeDoc.addEventListener("dragover", dragOver);
      iframeDoc.addEventListener("drop", (e) => {
        drop(e, instance);
      });

      filePicker.current.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          instance.loadDocument(file);
        }
      };
      const { annotManager, Annotations } = instance;
      setAnnotatManager(annotManager);

      // select only the insert group
      instance.setToolbarGroup("toolbarGroup-Insert");
      const normalStyles = (widget) => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            "background-color": "#a5c7ff",
            color: "white",
          };
        } else if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
          };
        }
      };

      annotManager.on(
        "annotationChanged",
        (annotations, action, { imported }) => {
          if (imported && action === "add") {
            annotations.forEach(function (annot) {
              if (annot instanceof Annotations.WidgetAnnotation) {
                Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
                annot.Hidden = true;
                annot.Listable = false;
              }
            });
          }
        }
      );
    });
  }, []);

  const download = () => {
    instance.downloadPdf(true);
  };

  const dragOver = (e) => {
    e.preventDefault();
    return false;
  };

  const drop = (e, instance) => {
    const { docViewer } = instance;
    const scrollElement = docViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;
    setDropPoint({ x: e.pageX + scrollLeft, y: e.pageY + scrollTop });
    e.preventDefault();
    return false;
  };

  return (
    <div className={"prepareDocument"}>
      <Container display="flex" direction="row" flex="grow">
        <Col span={12}>
          <div className="webviewer" ref={viewer}></div>
          <Container padding={3}>
            <Row xs={2} md={4} lg={6}>
              <Col>
                <Button
                  class="btn"
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="upload a document"
                  text="Upload"
                >
                  Upload
                </Button>
              </Col>
              <Col>
                <Button class="btn" onClick={download} text="Download">
                  Download
                </Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Container>
      <input type="file" ref={filePicker} style={{ display: "none" }} />
    </div>
  );
};

export default PrepareDocument;
