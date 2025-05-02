
package com.coursepath.lms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Module {
    private String id;
    private String title;
    private String content;
    private String videoUrl;
}
