package toy.cenibee.springfront.payroll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//  1. 스프링 MVC 컨트롤러로 선언한다.
@Controller
public class HomeController {

    //  2. / 경로에 대한 처리를 index()로 위임한다.
    @RequestMapping(value = "/")
    public String index() {
        //  3. index 템플릿을 사용하도록 한다.
        //      - Spring Boot 에서는 기본 템플릿 경로가 src/main/resources/templates 로 지정된다.
        return "index";
    }
}
