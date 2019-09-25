import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../../modules/auth/services/login/login.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { LoginSettings } from '../../../../settings/login.settings';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'ms-wall-of-sparkies',
	templateUrl: './wall-of-sparkies.component.html',
	styleUrls: ['./wall-of-sparkies.component.scss']
})
export class WallOfSparkiesComponent implements OnDestroy {
	public dataIndex = 0;
	public numberOfStudents = 0;
	public scrollInterval = 15;
	public timer;
	public dataArrFormatted = [];
	public dataArr;
	public fromDate = '';
	public toDate = '';
	public noShow = true;

	constructor(private authService: AuthService, private loginService: LoginService) {
		this.loginService.getSparkieChampForLastWeek().subscribe(result => {
			{
				if (result.studentList) {
					this.noShow = false;
					this.displayBoard(result);
					this.fromDate = result.fromDate;
					this.toDate = result.toDate;
				}
			}
		});
	}

	displayBoard(result) {
		this.dataArr = result;
		for (var i = 1; i <= 10; i++) {
			if (this.dataArr.studentList[i] == undefined) {
				continue;
			}
			else {
				for (var j = 0; j < this.dataArr.studentList[i].length; j++) {
					//this.dataArr.studentList[i][j]["orgName"]="chinmay vidhyalaya Smt PACR //Sethuramammal Nursery and primary school";
					this.dataArrFormatted[this.dataIndex] = this.dataArr.studentList[i][j];

					// Handling long Student Names
					if ((this.dataArrFormatted[this.dataIndex]["studentName"]).length > 30) {
						this.dataArrFormatted[this.dataIndex]["studentName"] = this.dataArrFormatted[this.dataIndex]["studentName"].substring(0, 30) + "...";
					}

					// Handling long School Names
					if ((this.dataArrFormatted[this.dataIndex]["orgName"]).length > 30) {
						this.dataArrFormatted[this.dataIndex]["orgName"] = this.dataArrFormatted[this.dataIndex]["orgName"].substring(0, 30) + "...";
					}
					this.dataIndex++;
				}
			}
		}
		this.numberOfStudents = this.dataArrFormatted.length;
		this.timer = setInterval(this.scrollDiv, this.scrollInterval);
	}

	hoverIn() {
		clearInterval(this.timer);
		this.timer = 0;
	}

	hoverOut() {
		this.timer = setInterval(this.scrollDiv, this.scrollInterval);
	}

	scrollDiv() {
		var element = document.getElementById('studentBoard');
		if (element != null) {
			if (element.scrollTop < (element.scrollHeight - element.offsetHeight)) {
				element.scrollTop = element.scrollTop + 1;
			}
			else {
				element.scrollTop = 0;
			}
		}
	}

	ngOnDestroy() {
		clearInterval(this.timer);
		this.timer = 0;
	}
}
