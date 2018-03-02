export default function ContactSearch(group) {
	var url = '/contByGroup?group=' + group

	var token = localStorage.getItem('token');

    var request = {
		headers: {
			'Authorization': 'Bearer '+token
		}
    }

	fetch(url,request)
		.then(res => res.json())
		.then(data => this.setState({ data : data.results }))
}