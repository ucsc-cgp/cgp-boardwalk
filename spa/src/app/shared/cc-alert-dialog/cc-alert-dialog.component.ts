import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "bw-cc-alert-dialog",
  templateUrl: "./cc-alert-dialog.component.html",
  styleUrls: ["./cc-alert-dialog.component.css"]
})
export class CCAlertDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CCAlertDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

}
