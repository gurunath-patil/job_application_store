// specific tab details
// const demo = chrome.tabs.query({active:true, currentWindow:true},(tab)=>{
//     console.log(tab);
// });

// all tabs
// const demo = chrome.tabs.query({},(tab)=>{
//     console.log(tab);
// });

// to create new tab
// chrome.tabs.onCreated.addListener((tab) => {
//     console.log('New tab created:', tab);
//   });

// const storage = chrome.storage.local
// storage.set({'name':'guru'},()=>{
//     console.log('data set');
// })

// storage.get('name',(res)=>{
//     console.log(res.name);
// })

document.addEventListener("DOMContentLoaded", addData)

async function addData() {
	const storage = await window.localStorage
	const localData = storage.getItem("jobapplicationData")
	if (localData) {
		const cardData = JSON.parse(localData)
		cardData.map(createCards)
	} else {
		alert("there is no any job application Data Save!")
	}

	chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
		try {
			const cardData = JSON.parse(localData)
			cardData.map((item) => {
				if (item.application_url == tab[0].url) {
					alert("any job application fill in this company!")
				}
			})
		} catch (err) {
			console.log(err)
		}
	})

	chrome.tabs.query({}, (tab) => {
		tab.map((item) => {
			const optiontag = $("<option></option>").attr("value", item.url)
			optiontag.text(`${item.title}`)
			$("#job-url").append(optiontag)
		})
	})

	$("#search-bar").change((event) => {
		const local = JSON.parse(localData)
		if(event.target.value != ""){
			const searchData = local.filter((res) => ((event.target.value).trim()).toLowerCase() == (res.job_profile).toLowerCase())
			if (Object.keys(searchData).length != 0) {
				document.getElementById('main-card-box').innerHTML =''
				for(let items of searchData){
					createCards(items)
				}
			} else {
				alert("job not found!")
			}
		}else{
			document.getElementById('main-card-box').innerHTML =''
			for(let items of local){
				createCards(items)
			}
		}
	})
	$("#back-btn").click(() => {
		window.location.href = "./index.html"
	})

	$("#add-btn").click(() => {
		window.location.href = "./addJob.html"
	})

	$("#add-New-Job").click((res) => {
		const jobtitle = $("#job-title").val()
		const experinceInput = $("#experience").val()
		const webURL = $("#job-url").val()
		const current_date = getCuurentDate()
		const obj = {
			job_profile: jobtitle.trim(),
			experience: experinceInput,
			application_url: webURL,
			application_date: current_date,
		}
		try {
			if (localData != null) {
				const localDataAfterFetch = JSON.parse(localData)
				localDataAfterFetch.push(obj)
				const sendData = JSON.stringify(localDataAfterFetch)
				storage.setItem("jobapplicationData", sendData)
			} else {
				let jsonObj = JSON.stringify([obj])
				storage.setItem("jobapplicationData", jsonObj)
			}
		} catch (err) {
			alert("something went wrong you data might be not save!, please contact to developer")
		} finally {
			window.location.href = "./index.html"
		}
	})

	function deleteApplication(companyUrl) {
		const localDataAfterFetch = JSON.parse(localData)
		localDataAfterFetch.map((obj, index) => {
			if (companyUrl == obj.application_url) {
				localDataAfterFetch.splice(index, 1)
				storage.removeItem("jobapplicationData")
				const localDataintoJson = JSON.stringify(localDataAfterFetch)
				storage.setItem("jobapplicationData", localDataintoJson)
				window.location.reload()
			}
		})
	}

	function getCuurentDate() {
		const date = new Date()

		const day = date.getDate()
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		]
		const month = monthNames[date.getMonth()]
		const year = date.getFullYear()

		return `${day} ${month}, ${year}`
	}

	$(".deletebtn").click((res) => {
		deleteApplication(res.target.id)
	})

	function createCards(item) {
		const card_container = $("<div></div>").attr("class", "card-box")

		const outerDateContainer = $("<div></div>")
		const date_container = $("<div></div>")
			.attr("class", "date-box")
			.append($("<span></span>").text(`${item.application_date}`))
		const deletebtn = $("<div></div>").attr({ class: "deletebtn", id: item.application_url })
		deletebtn.append(
			$("<i></i>").attr({ class: "bi bi-trash text-danger h5", id: item.application_url })
		)
		outerDateContainer.append(date_container, deletebtn)

		const jobProfile = $("<h6></h6>").append(`${item.job_profile}`)
		const experince = $("<h6></h6>").append(`${item.experience}`)

		const jobLinkContainer = $("<div></div>").attr("class", "d-flex justify-content-center")
		const jobUrlLinkBtn = $("<a></a>")
			.attr({
				class: "btn btn-dark w-50 d-flex justify-content-center align-items-center",
				href: `${item.application_url}`,
				target: "_blank",
			})
			.text("Link")
		jobLinkContainer.append(jobUrlLinkBtn)

		card_container.append(outerDateContainer, jobProfile, experince, jobLinkContainer)
		$("#main-card-box").append(card_container)
	}
}
